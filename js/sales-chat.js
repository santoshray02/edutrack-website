/**
 * EdunodeX AI Sales Chat Widget v3
 * 2026 lead-gen chat: full-width bot messages, markdown rendering,
 * typewriter streaming, persistent CTAs, bottom-sheet mobile.
 */
(function () {
  'use strict';

  var API_BASE = 'https://in1.edunodex.in/api/v1/sales-chat';
  var STORAGE_KEY = 'edx_chat_session';
  var MAX_INPUT_LENGTH = 2000;
  var AVATAR_URL = 'https://edunodex.in/images/favicon.png';

  var sessionId = null;
  var isOpen = false;
  var isLoading = false;
  var messageHistory = [];
  var userHasScrolled = false;

  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      var data = JSON.parse(saved);
      sessionId = data.sessionId;
      messageHistory = data.messages || [];
    }
  } catch (e) {}

  function getUtmParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
    };
  }

  function escapeHtml(text) {
    var d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  // --- Markdown renderer (safe) ---
  function renderMarkdown(text) {
    var escaped = escapeHtml(text);
    // Bold
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Numbered lists
    escaped = escaped.replace(/^(\d+)\.\s+(.+)$/gm, '<li class="edx-li-num"><span class="edx-li-n">$1.</span> $2</li>');
    // Bullet lists
    escaped = escaped.replace(/^[-•]\s+(.+)$/gm, '<li class="edx-li-bul">$1</li>');
    // Wrap consecutive <li> in <ul>/<ol>
    escaped = escaped.replace(/((?:<li class="edx-li-num">.*<\/li>\n?)+)/g, '<ol class="edx-ol">$1</ol>');
    escaped = escaped.replace(/((?:<li class="edx-li-bul">.*<\/li>\n?)+)/g, '<ul class="edx-ul">$1</ul>');
    // Links: [text](url)
    escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="edx-link">$1</a>');
    // Line breaks (but not inside lists)
    escaped = escaped.replace(/\n/g, '<br>');
    // Clean up extra <br> around lists
    escaped = escaped.replace(/<br>\s*<(ol|ul)/g, '<$1');
    escaped = escaped.replace(/<\/(ol|ul)>\s*<br>/g, '</$1>');
    return escaped;
  }

  function createWidget() {
    var style = document.createElement('style');
    style.textContent = '\
@keyframes edx-up{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}\
@keyframes edx-fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}\
@keyframes edx-dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}\
@keyframes edx-pulse{0%{transform:scale(1);opacity:1}100%{transform:scale(1.4);opacity:0}}\
@keyframes edx-pop{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}\
@keyframes edx-cursor{0%,100%{opacity:1}50%{opacity:0}}\
\
#edx-chat-widget{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;position:fixed;bottom:20px;right:20px;z-index:9999}\
@media(max-width:768px){#edx-chat-widget{bottom:76px;right:12px}}\
\
.edx-trigger{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#2563eb);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 28px rgba(124,58,237,.35);transition:all .25s;position:relative}\
.edx-trigger:hover{transform:scale(1.06);box-shadow:0 10px 36px rgba(124,58,237,.45)}\
.edx-trigger svg{width:26px;height:26px;fill:#fff}\
.edx-trigger .edx-ring{position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(124,58,237,.5);animation:edx-pulse 2s ease-out infinite}\
.edx-trigger.edx-open .edx-ring{display:none}\
\
.edx-win{display:none;position:absolute;bottom:72px;right:0;width:400px;max-width:calc(100vw - 24px);height:580px;max-height:calc(100vh - 120px);background:#fff;border-radius:16px;box-shadow:0 20px 64px rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.04);flex-direction:column;overflow:hidden;animation:edx-up .3s cubic-bezier(.4,0,.2,1)}\
.edx-win.edx-open{display:flex}\
@media(max-width:480px){.edx-win{position:fixed;left:0;right:0;bottom:0;top:auto;width:100%;height:85vh;height:85dvh;max-width:100%;max-height:85vh;max-height:85dvh;border-radius:20px 20px 0 0;box-shadow:0 -8px 40px rgba(0,0,0,.15)}}\
\
.edx-hdr{background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:10px 14px;display:flex;align-items:center;gap:10px;flex-shrink:0}\
.edx-hdr-av{width:34px;height:34px;border-radius:9px;overflow:hidden;flex-shrink:0;background:rgba(255,255,255,.15)}\
.edx-hdr-av img{width:100%;height:100%;object-fit:cover}\
.edx-hdr-info{flex:1}\
.edx-hdr-name{color:#fff;font-weight:700;font-size:14px;line-height:1.2}\
.edx-hdr-stat{color:rgba(255,255,255,.7);font-size:11.5px;display:flex;align-items:center;gap:5px}\
.edx-hdr-stat::before{content:"";width:6px;height:6px;background:#34d399;border-radius:50%;display:inline-block}\
.edx-hdr-actions{display:flex;align-items:center;gap:4px}\
.edx-hdr-btn{background:rgba(255,255,255,.12);border:none;cursor:pointer;border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;transition:background .2s;text-decoration:none}\
.edx-hdr-btn:hover{background:rgba(255,255,255,.22)}\
.edx-hdr-btn svg{width:15px;height:15px}\
.edx-hdr-btn-wa svg{fill:#fff}\
.edx-hdr-btn-call svg{stroke:#fff;fill:none;stroke-width:2}\
.edx-hdr-close{background:rgba(255,255,255,.12);border:none;cursor:pointer;border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;transition:background .2s}\
.edx-hdr-close:hover{background:rgba(255,255,255,.22)}\
.edx-hdr-close svg{width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2.2}\
\
.edx-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:2px;scroll-behavior:smooth}\
.edx-msgs::-webkit-scrollbar{width:3px}\
.edx-msgs::-webkit-scrollbar-thumb{background:#d4d4d8;border-radius:3px}\
\
.edx-msg-u{align-self:flex-end;max-width:80%;animation:edx-fade .25s ease;margin-top:8px}\
.edx-msg-u-bub{padding:10px 14px;border-radius:18px 18px 4px 18px;font-size:15px;line-height:1.5;color:#fff;background:linear-gradient(135deg,#7c3aed,#6d28d9);word-break:break-word}\
\
.edx-msg-b{display:flex;gap:8px;align-items:flex-start;animation:edx-fade .25s ease;margin-top:8px;max-width:95%}\
.edx-msg-b-av{width:28px;height:28px;border-radius:7px;overflow:hidden;flex-shrink:0;margin-top:2px}\
.edx-msg-b-av img{width:100%;height:100%;object-fit:cover}\
.edx-msg-b-body{flex:1;font-size:15px;line-height:1.6;color:#1a1a2e;word-break:break-word;padding:2px 0}\
.edx-msg-b-body strong{font-weight:600;color:#111}\
.edx-msg-b-body .edx-link{color:#7c3aed;text-decoration:none;font-weight:500;border-bottom:1px solid rgba(124,58,237,.2)}\
.edx-msg-b-body .edx-link:hover{border-bottom-color:#7c3aed}\
.edx-msg-b-body .edx-ol,.edx-msg-b-body .edx-ul{margin:6px 0;padding-left:4px;list-style:none}\
.edx-msg-b-body .edx-li-num,.edx-msg-b-body .edx-li-bul{padding:3px 0;padding-left:16px;position:relative;font-size:14.5px;line-height:1.55}\
.edx-msg-b-body .edx-li-num .edx-li-n{position:absolute;left:0;font-weight:600;color:#7c3aed}\
.edx-msg-b-body .edx-li-bul::before{content:"";position:absolute;left:4px;top:11px;width:5px;height:5px;border-radius:50%;background:#7c3aed;opacity:.5}\
\
.edx-typing{display:flex;gap:8px;align-items:flex-start;animation:edx-fade .2s ease;margin-top:12px}\
.edx-typing-dots{display:flex;gap:4px;padding:12px 0}\
.edx-typing-dot{width:7px;height:7px;background:#b4b4c8;border-radius:50%;animation:edx-dot 1.4s ease-in-out infinite}\
.edx-typing-dot:nth-child(2){animation-delay:.15s}\
.edx-typing-dot:nth-child(3){animation-delay:.3s}\
\
.edx-cursor{display:inline-block;width:2px;height:16px;background:#7c3aed;margin-left:2px;vertical-align:text-bottom;animation:edx-cursor .8s ease infinite}\
\
.edx-sugg{padding:4px 16px 10px;flex-shrink:0;animation:edx-fade .35s ease}\
.edx-sugg-lbl{font-size:10.5px;font-weight:600;color:#a1a1b5;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;padding-left:36px}\
.edx-sugg-list{display:flex;flex-wrap:wrap;gap:6px;padding-left:36px}\
.edx-sugg-btn{padding:7px 13px;border-radius:99px;border:1.5px solid #e8e8ef;background:#fff;color:#3a3a52;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;white-space:nowrap;animation:edx-pop .25s ease backwards;line-height:1.3}\
.edx-sugg-btn:nth-child(1){animation-delay:.05s}\
.edx-sugg-btn:nth-child(2){animation-delay:.1s}\
.edx-sugg-btn:nth-child(3){animation-delay:.15s}\
.edx-sugg-btn:hover{border-color:#7c3aed;color:#7c3aed;background:#f8f5ff;transform:translateY(-1px)}\
.edx-sugg-btn:active{transform:scale(.96)}\
\
.edx-qr{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 10px 52px;flex-shrink:0}\
.edx-qr-btn{padding:9px 15px;border-radius:99px;border:1.5px solid #e8e8ef;background:#fff;color:#3a3a52;font-size:13.5px;font-weight:500;cursor:pointer;transition:all .2s;animation:edx-pop .3s ease backwards}\
.edx-qr-btn:nth-child(1){animation-delay:.1s}\
.edx-qr-btn:nth-child(2){animation-delay:.2s}\
.edx-qr-btn:nth-child(3){animation-delay:.3s}\
.edx-qr-btn:nth-child(4){animation-delay:.4s}\
.edx-qr-btn:hover{border-color:#7c3aed;color:#7c3aed;background:#f8f5ff}\
\
\
\
.edx-input{padding:8px 12px;border-top:1px solid #f0f0f5;display:flex;align-items:center;gap:8px;flex-shrink:0;background:#fff}\
.edx-input input{flex:1;border:1.5px solid #e8e8ef;border-radius:24px;padding:9px 14px;font-size:15px;font-family:inherit;outline:none;transition:border-color .2s,box-shadow .2s;background:#fafafe}\
.edx-input input:focus{border-color:#7c3aed;background:#fff;box-shadow:0 0 0 3px rgba(124,58,237,.06)}\
.edx-input input::placeholder{color:#a1a1b5}\
.edx-send{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#6d28d9);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}\
.edx-send:hover{transform:scale(1.05);box-shadow:0 3px 12px rgba(124,58,237,.25)}\
.edx-send:disabled{opacity:.4;cursor:not-allowed;transform:none;box-shadow:none}\
.edx-send svg{width:17px;height:17px;fill:#fff}\
\
.edx-foot{text-align:center;padding:4px;font-size:10px;color:#c4c4d4;background:#fafafe;flex-shrink:0}\
.edx-chat-inline .edx-foot{display:none}\
.edx-foot a{color:#9b8ec4;text-decoration:none;font-weight:500}\
\
.edx-toast{position:absolute;top:60px;left:14px;right:14px;background:linear-gradient(135deg,#059669,#10b981);color:#fff;padding:11px 14px;border-radius:10px;font-size:13px;font-weight:600;text-align:center;z-index:10;animation:edx-fade .3s ease;box-shadow:0 4px 16px rgba(5,150,105,.25)}\
\
.edx-scroll-btn{position:absolute;bottom:120px;left:50%;transform:translateX(-50%);background:#fff;border:1px solid #e8e8ef;border-radius:99px;padding:6px 14px;font-size:11px;font-weight:600;color:#666;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.08);z-index:5;display:none;animation:edx-fade .2s ease}\
.edx-scroll-btn:hover{background:#f8f5ff;color:#7c3aed;border-color:#7c3aed}\
\
.edx-chat-inline .edx-win{position:relative;bottom:auto;right:auto;width:100%;height:560px;max-width:100%;display:flex;border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,.08),0 0 0 1px rgba(0,0,0,.03)}\
.edx-chat-inline .edx-trigger{display:none}\
@media(max-width:480px){.edx-chat-inline .edx-win{border-radius:14px;position:relative;height:calc(100vh - 160px);min-height:420px;max-height:600px}}\
';
    document.head.appendChild(style);

    // --- DOM ---
    var widget = document.createElement('div');
    widget.id = 'edx-chat-widget';

    // Trigger
    var trigger = document.createElement('button');
    trigger.className = 'edx-trigger';
    trigger.setAttribute('aria-label', 'Chat with EdunodeX AI');
    var ring = document.createElement('div');
    ring.className = 'edx-ring';
    trigger.appendChild(ring);
    var tSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tSvg.setAttribute('viewBox', '0 0 24 24');
    var tPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tPath.setAttribute('d', 'M12 2C6.48 2 2 6.48 2 12c0 1.74.5 3.37 1.35 4.76L2 22l5.24-1.35C8.63 21.5 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm2.07-6.75l-.9.92C11.45 10.9 11 11.5 11 13h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H6c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z');
    tSvg.appendChild(tPath);
    trigger.appendChild(tSvg);
    widget.appendChild(trigger);

    // Window
    var win = document.createElement('div');
    win.className = 'edx-win';

    // Header
    var hdr = document.createElement('div');
    hdr.className = 'edx-hdr';
    var hAv = document.createElement('div');
    hAv.className = 'edx-hdr-av';
    var hImg = document.createElement('img');
    hImg.src = AVATAR_URL;
    hImg.alt = 'EdunodeX AI';
    hImg.onerror = function() { this.parentElement.textContent = 'E'; };
    hAv.appendChild(hImg);
    hdr.appendChild(hAv);
    var hInfo = document.createElement('div');
    hInfo.className = 'edx-hdr-info';
    var hName = document.createElement('div');
    hName.className = 'edx-hdr-name';
    hName.textContent = 'EdunodeX AI';
    hInfo.appendChild(hName);
    var hStat = document.createElement('div');
    hStat.className = 'edx-hdr-stat';
    hStat.textContent = 'Online now';
    hInfo.appendChild(hStat);
    hdr.appendChild(hInfo);

    // Header action buttons: WhatsApp, Call, Close
    var hdrActions = document.createElement('div');
    hdrActions.className = 'edx-hdr-actions';

    // WhatsApp button
    var waBtn = document.createElement('a');
    waBtn.className = 'edx-hdr-btn edx-hdr-btn-wa';
    waBtn.href = 'https://wa.me/917880170555?text=Hi%2C%20I%27m%20interested%20in%20EdunodeX';
    waBtn.target = '_blank';
    waBtn.rel = 'noopener';
    waBtn.setAttribute('aria-label', 'WhatsApp');
    waBtn.title = 'Chat on WhatsApp';
    var waSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    waSvg.setAttribute('viewBox', '0 0 24 24');
    var waP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    waP.setAttribute('d', 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z');
    waSvg.appendChild(waP);
    waBtn.appendChild(waSvg);
    hdrActions.appendChild(waBtn);

    // Call button
    var callBtn = document.createElement('a');
    callBtn.className = 'edx-hdr-btn edx-hdr-btn-call';
    callBtn.href = 'tel:+917880170555';
    callBtn.setAttribute('aria-label', 'Call');
    callBtn.title = 'Call 7880170555';
    var callSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    callSvg.setAttribute('viewBox', '0 0 24 24');
    var callP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    callP.setAttribute('stroke-linecap', 'round');
    callP.setAttribute('stroke-linejoin', 'round');
    callP.setAttribute('d', 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z');
    callSvg.appendChild(callP);
    callBtn.appendChild(callSvg);
    hdrActions.appendChild(callBtn);

    // Close button
    var closeBtn = document.createElement('button');
    closeBtn.className = 'edx-hdr-close';
    closeBtn.setAttribute('aria-label', 'Close');
    var cSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    cSvg.setAttribute('viewBox', '0 0 24 24');
    var cl1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    cl1.setAttribute('x1','18');cl1.setAttribute('y1','6');cl1.setAttribute('x2','6');cl1.setAttribute('y2','18');
    var cl2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    cl2.setAttribute('x1','6');cl2.setAttribute('y1','6');cl2.setAttribute('x2','18');cl2.setAttribute('y2','18');
    cSvg.appendChild(cl1);
    cSvg.appendChild(cl2);
    closeBtn.appendChild(cSvg);
    hdrActions.appendChild(closeBtn);

    hdr.appendChild(hdrActions);
    win.appendChild(hdr);

    // Messages
    var msgs = document.createElement('div');
    msgs.className = 'edx-msgs';
    msgs.id = 'edx-msgs';
    win.appendChild(msgs);

    // Scroll to bottom button
    var scrollBtn = document.createElement('button');
    scrollBtn.className = 'edx-scroll-btn';
    scrollBtn.textContent = '\u2193 New messages';
    scrollBtn.addEventListener('click', function() {
      scrollToBottom(true);
      scrollBtn.style.display = 'none';
    });
    win.appendChild(scrollBtn);

    // Suggestions container
    var suggBox = document.createElement('div');
    suggBox.className = 'edx-sugg';
    suggBox.id = 'edx-sugg';
    suggBox.style.display = 'none';
    win.appendChild(suggBox);

    // Quick replies container
    var qrBox = document.createElement('div');
    qrBox.className = 'edx-qr';
    qrBox.id = 'edx-qr';
    win.appendChild(qrBox);

    // Input
    var inputWrap = document.createElement('div');
    inputWrap.className = 'edx-input';
    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'edx-inp';
    input.placeholder = 'Ask about pricing, features, demo\u2026';
    input.maxLength = MAX_INPUT_LENGTH;
    input.autocomplete = 'off';
    inputWrap.appendChild(input);
    var sendBtn = document.createElement('button');
    sendBtn.className = 'edx-send';
    sendBtn.id = 'edx-send';
    sendBtn.setAttribute('aria-label', 'Send');
    var sSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sSvg.setAttribute('viewBox', '0 0 24 24');
    var sPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sPath.setAttribute('d', 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z');
    sSvg.appendChild(sPath);
    sendBtn.appendChild(sSvg);
    inputWrap.appendChild(sendBtn);
    win.appendChild(inputWrap);

    // Footer
    var foot = document.createElement('div');
    foot.className = 'edx-foot';
    foot.textContent = 'Powered by ';
    var fLink = document.createElement('a');
    fLink.href = 'https://edunodex.in';
    fLink.target = '_blank';
    fLink.textContent = 'EdunodeX AI';
    foot.appendChild(fLink);
    win.appendChild(foot);

    widget.appendChild(win);
    document.body.appendChild(widget);

    // --- Scroll detection ---
    msgs.addEventListener('scroll', function() {
      var atBottom = msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 60;
      userHasScrolled = !atBottom;
      if (atBottom) scrollBtn.style.display = 'none';
    });

    // --- Events ---
    trigger.addEventListener('click', function () {
      isOpen = !isOpen;
      win.classList.toggle('edx-open', isOpen);
      trigger.classList.toggle('edx-open', isOpen);
      if (isOpen) {
        input.focus();
        if (messageHistory.length === 0) showWelcome();
        scrollToBottom();
      }
    });
    closeBtn.addEventListener('click', function () {
      isOpen = false;
      win.classList.remove('edx-open');
      trigger.classList.remove('edx-open');
    });
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });

    // Inline mode
    var inlineEl = document.getElementById('edx-chat-inline');
    if (inlineEl) {
      // "data-inline-only" = no floating bubble (ads page)
      // Without it = inline chat + floating bubble (main page)
      var inlineOnly = inlineEl.hasAttribute('data-inline-only');
      if (inlineOnly) {
        inlineEl.classList.add('edx-chat-inline');
        inlineEl.appendChild(win);
        win.classList.add('edx-open');
        trigger.style.display = 'none';
        isOpen = true;
      } else {
        // Clone the chat into inline, keep floating bubble too
        var inlineWin = win.cloneNode(true);
        inlineEl.classList.add('edx-chat-inline');
        inlineEl.appendChild(inlineWin);
        inlineWin.classList.add('edx-open');
        // Render welcome in inline clone
        var inlineMsgs = inlineWin.querySelector('.edx-msgs');
        if (inlineMsgs && inlineMsgs.children.length === 0) {
          var row = document.createElement('div');
          row.className = 'edx-msg-b';
          row.appendChild(makeBotAvatar());
          var body = document.createElement('div');
          body.className = 'edx-msg-b-body';
          body.innerHTML = renderMarkdown("Hi! I\u2019m **EdunodeX AI** \u2014 your guide to India\u2019s School OS.\n\nI can help with pricing, features, or set up a **free demo**. What brings you here?");
          row.appendChild(body);
          inlineMsgs.appendChild(row);
        }
      }
    }

    // --- Functions ---
    var welcomeShown = false;
    function showWelcome() {
      if (welcomeShown) return;
      welcomeShown = true;
      addBotMsg("Hi! I\u2019m **EdunodeX AI** \u2014 your guide to India\u2019s School OS.\n\nI can help with pricing, features, or set up a **free demo**. What brings you here?");
      showQuickReplies([
        "\uD83D\uDCA1 What is EdunodeX?",
        "\uD83D\uDCB0 Show me pricing",
        "\uD83D\uDCCA Fee collection",
        "\uD83C\uDFAF Book a free demo",
      ]);
    }

    function showQuickReplies(options) {
      qrBox.textContent = '';
      hideSuggestions();
      options.forEach(function (text) {
        var btn = document.createElement('button');
        btn.className = 'edx-qr-btn';
        btn.textContent = text;
        btn.addEventListener('click', function () {
          qrBox.textContent = '';
          input.value = text.replace(/^[\uD83C-\uDBFF][\uDC00-\uDFFF]\s?/, '');
          sendMessage();
        });
        qrBox.appendChild(btn);
      });
    }

    function showSuggestions(list) {
      if (!list || !list.length) { hideSuggestions(); return; }
      suggBox.textContent = '';
      suggBox.style.display = 'block';
      var lbl = document.createElement('div');
      lbl.className = 'edx-sugg-lbl';
      lbl.textContent = 'Suggested';
      suggBox.appendChild(lbl);
      var row = document.createElement('div');
      row.className = 'edx-sugg-list';
      list.forEach(function (text) {
        var btn = document.createElement('button');
        btn.className = 'edx-sugg-btn';
        btn.textContent = text;
        btn.addEventListener('click', function () {
          hideSuggestions();
          input.value = text;
          sendMessage();
        });
        row.appendChild(btn);
      });
      suggBox.appendChild(row);
    }

    function hideSuggestions() {
      suggBox.style.display = 'none';
      suggBox.textContent = '';
    }

    function makeBotAvatar() {
      var av = document.createElement('div');
      av.className = 'edx-msg-b-av';
      var img = document.createElement('img');
      img.src = AVATAR_URL;
      img.alt = 'E';
      img.onerror = function() { this.parentElement.textContent = 'E'; };
      av.appendChild(img);
      return av;
    }

    function addBotMsg(text, skipHistory) {
      var row = document.createElement('div');
      row.className = 'edx-msg-b';
      row.appendChild(makeBotAvatar());
      var body = document.createElement('div');
      body.className = 'edx-msg-b-body';
      body.innerHTML = renderMarkdown(text);
      row.appendChild(body);
      msgs.appendChild(row);
      if (!skipHistory) {
        messageHistory.push({ role: 'assistant', content: text });
        saveSession();
      }
      scrollToBottom();
      return body;
    }

    function addBotMsgStreaming(text) {
      var row = document.createElement('div');
      row.className = 'edx-msg-b';
      row.appendChild(makeBotAvatar());
      var body = document.createElement('div');
      body.className = 'edx-msg-b-body';
      row.appendChild(body);
      msgs.appendChild(row);

      // Typewriter effect
      var cursor = document.createElement('span');
      cursor.className = 'edx-cursor';
      body.appendChild(cursor);

      var idx = 0;
      var speed = 12;
      var buf = '';

      function tick() {
        if (idx < text.length) {
          buf += text[idx];
          idx++;
          // Render current buffer as markdown, append cursor
          body.innerHTML = renderMarkdown(buf);
          body.appendChild(cursor);
          scrollToBottom();
          // Vary speed: pause longer on newlines and periods
          var ch = text[idx - 1];
          var delay = (ch === '\n') ? 80 : (ch === '.' || ch === '!' || ch === '?') ? 60 : speed;
          setTimeout(tick, delay);
        } else {
          // Done — remove cursor, finalize
          if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          body.innerHTML = renderMarkdown(text);
          messageHistory.push({ role: 'assistant', content: text });
          saveSession();
        }
      }
      tick();
      return body;
    }

    function addUserMsg(text, skipHistory) {
      var div = document.createElement('div');
      div.className = 'edx-msg-u';
      var bub = document.createElement('div');
      bub.className = 'edx-msg-u-bub';
      bub.innerHTML = renderMarkdown(text);
      div.appendChild(bub);
      msgs.appendChild(div);
      if (!skipHistory) {
        messageHistory.push({ role: 'user', content: text });
        saveSession();
      }
      scrollToBottom();
    }

    function showTyping() {
      var row = document.createElement('div');
      row.className = 'edx-typing';
      row.id = 'edx-typing';
      row.appendChild(makeBotAvatar());
      var dots = document.createElement('div');
      dots.className = 'edx-typing-dots';
      for (var i = 0; i < 3; i++) {
        var d = document.createElement('div');
        d.className = 'edx-typing-dot';
        dots.appendChild(d);
      }
      row.appendChild(dots);
      msgs.appendChild(row);
      scrollToBottom();
    }

    function hideTyping() {
      var el = document.getElementById('edx-typing');
      if (el) el.remove();
    }

    function showToast(text) {
      var toast = document.createElement('div');
      toast.className = 'edx-toast';
      toast.textContent = text;
      win.appendChild(toast);
      setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity .4s';
        setTimeout(function() { toast.remove(); }, 400);
      }, 3500);
    }

    function scrollToBottom(force) {
      if (!force && userHasScrolled) {
        scrollBtn.style.display = 'block';
        return;
      }
      setTimeout(function () {
        msgs.scrollTop = msgs.scrollHeight;
      }, 30);
    }

    async function sendMessage() {
      var text = input.value.trim();
      if (!text || isLoading) return;

      input.value = '';
      qrBox.textContent = '';
      hideSuggestions();
      addUserMsg(text);
      showTyping();
      isLoading = true;
      sendBtn.disabled = true;

      try {
        var body = { message: text, session_id: sessionId };
        if (!sessionId) {
          var utm = getUtmParams();
          if (utm.utm_source) body.utm_source = utm.utm_source;
          if (utm.utm_medium) body.utm_medium = utm.utm_medium;
          if (utm.utm_campaign) body.utm_campaign = utm.utm_campaign;
          // Send page context on first message
          body.page_url = window.location.href;
          body.referrer = document.referrer || '';
        }

        var resp = await fetch(API_BASE + '/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        hideTyping();

        if (!resp.ok) {
          if (resp.status === 429) {
            addBotMsg("I\u2019m getting a lot of questions right now! Please wait a moment, or reach us directly at **7880170555**.");
          } else {
            throw new Error('API error');
          }
          return;
        }

        var data = await resp.json();
        sessionId = data.session_id;

        // Streaming typewriter for bot response
        addBotMsgStreaming(data.reply);
        saveSession();

        // Show suggestions after streaming completes
        if (data.suggestions && data.suggestions.length > 0) {
          var streamTime = data.reply.length * 15 + 200;
          setTimeout(function() {
            showSuggestions(data.suggestions);
          }, Math.min(streamTime, 3000));
        }

        // Lead conversion
        if (data.lead_collected) {
          setTimeout(function() {
            showToast('\u2705 Thanks! Our team will reach out shortly.');
          }, 500);
          if (typeof gtag === 'function') {
            gtag('event', 'generate_lead', {
              event_category: 'Sales Chat',
              event_label: 'AI Chatbot Lead',
              value: 1,
            });
            gtag('event', 'conversion', {
              send_to: 'AW-18055680778/NQnJCOWvzpMcEIqmz6FD',
              value: 1.0,
              currency: 'INR'
            });
          }
        }

      } catch (err) {
        hideTyping();
        addBotMsg("I\u2019m having a brief connection issue. Reach us at **7880170555** or sign up at **in1.edunodex.in/signup**.");
        showSuggestions(["Try again", "Show pricing", "Book a demo"]);
        console.error('EdunodeX chat error:', err);
      } finally {
        isLoading = false;
        sendBtn.disabled = false;
        input.focus();
      }
    }

    function saveSession() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          sessionId: sessionId,
          messages: messageHistory.slice(-40),
        }));
      } catch (e) {}
    }

    // Restore history
    if (messageHistory.length > 0) {
      var saved = messageHistory.slice();
      messageHistory = [];
      saved.forEach(function (m) {
        if (m.role === 'assistant') addBotMsg(m.content, true);
        else addUserMsg(m.content, true);
      });
      messageHistory = saved;
    }

    // Show welcome if no history was restored (inline or floating)
    if (messageHistory.length === 0 && isOpen) {
      showWelcome();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
