/**
 * EdunodeX AI Sales Chat Widget v2
 * Modern conversational AI chatbot for lead generation with suggested follow-ups.
 * Connects to /api/v1/sales-chat/message on the EdunodeX backend.
 */
(function () {
  'use strict';

  // --- Configuration ---
  const API_BASE = 'https://in1.edunodex.in/api/v1/sales-chat';
  const STORAGE_KEY = 'edx_chat_session';
  const MAX_INPUT_LENGTH = 2000;

  // --- State ---
  let sessionId = null;
  let isOpen = false;
  let isLoading = false;
  let messageHistory = [];

  // Restore session
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      sessionId = data.sessionId;
      messageHistory = data.messages || [];
    }
  } catch (e) { /* ignore */ }

  // Get UTM params
  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
    };
  }

  // Safe text escaping
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --- Build Widget DOM ---
  function createWidget() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = [
      '@keyframes edx-slide-up { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }',
      '@keyframes edx-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }',
      '@keyframes edx-typing-dot { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }',
      '@keyframes edx-pulse-ring { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }',
      '@keyframes edx-suggestion-pop { from { opacity: 0; transform: scale(0.9) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }',
      '#edx-chat-widget { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; position: fixed; bottom: 24px; right: 24px; z-index: 9999; }',
      '@media (max-width: 768px) { #edx-chat-widget { bottom: 80px; right: 12px; } }',
      '.edx-chat-trigger { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #2563eb); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(124, 58, 237, 0.4); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }',
      '.edx-chat-trigger:hover { transform: scale(1.08); box-shadow: 0 12px 40px rgba(124, 58, 237, 0.5); }',
      '.edx-chat-trigger svg { width: 28px; height: 28px; fill: white; }',
      '.edx-chat-trigger .edx-pulse { position: absolute; inset: -4px; border-radius: 50%; border: 2px solid rgba(124, 58, 237, 0.6); animation: edx-pulse-ring 2s ease-out infinite; }',
      '.edx-chat-trigger.edx-open .edx-pulse { display: none; }',
      '.edx-chat-window { display: none; position: absolute; bottom: 76px; right: 0; width: 420px; max-width: calc(100vw - 24px); height: 600px; max-height: calc(100vh - 140px); background: #ffffff; border-radius: 20px; box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05); flex-direction: column; overflow: hidden; animation: edx-slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1); }',
      '.edx-chat-window.edx-visible { display: flex; }',
      '@media (max-width: 480px) { .edx-chat-window { position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; max-width: 100%; max-height: 100%; border-radius: 0; bottom: auto; } }',
      '.edx-chat-header { background: linear-gradient(135deg, #7c3aed, #2563eb); padding: 16px 20px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }',
      '.edx-chat-avatar { width: 42px; height: 42px; border-radius: 12px; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; overflow: hidden; }',
      '.edx-chat-avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }',
      '.edx-chat-header-info { flex: 1; }',
      '.edx-chat-header-name { color: white; font-weight: 700; font-size: 15px; line-height: 1.2; }',
      '.edx-chat-header-status { color: rgba(255,255,255,0.8); font-size: 12px; display: flex; align-items: center; gap: 6px; }',
      '.edx-chat-header-status::before { content: ""; width: 7px; height: 7px; background: #34d399; border-radius: 50%; display: inline-block; }',
      '.edx-chat-close { background: rgba(255,255,255,0.15); border: none; cursor: pointer; border-radius: 10px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }',
      '.edx-chat-close:hover { background: rgba(255,255,255,0.25); }',
      '.edx-chat-close svg { width: 18px; height: 18px; stroke: white; fill: none; stroke-width: 2; }',
      '.edx-chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 6px; scroll-behavior: smooth; }',
      '.edx-chat-messages::-webkit-scrollbar { width: 4px; }',
      '.edx-chat-messages::-webkit-scrollbar-track { background: transparent; }',
      '.edx-chat-messages::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }',
      '.edx-msg { max-width: 85%; animation: edx-fade-in 0.3s ease; }',
      '.edx-msg-bot { align-self: flex-start; }',
      '.edx-msg-user { align-self: flex-end; }',
      '.edx-msg-bubble { padding: 12px 16px; border-radius: 18px; font-size: 14px; line-height: 1.55; word-break: break-word; }',
      '.edx-msg-bot .edx-msg-bubble { background: #f3f4f6; color: #1f2937; border-bottom-left-radius: 6px; }',
      '.edx-msg-user .edx-msg-bubble { background: linear-gradient(135deg, #7c3aed, #2563eb); color: white; border-bottom-right-radius: 6px; }',
      '.edx-msg-bot-row { display: flex; align-items: flex-end; gap: 8px; align-self: flex-start; max-width: 88%; animation: edx-fade-in 0.3s ease; }',
      '.edx-msg-bot-avatar { width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0; overflow: hidden; }',
      '.edx-msg-bot-avatar img { width: 100%; height: 100%; object-fit: cover; }',
      '.edx-typing-row { display: flex; align-items: flex-end; gap: 8px; align-self: flex-start; animation: edx-fade-in 0.2s ease; }',
      '.edx-typing { display: flex; gap: 5px; padding: 14px 18px; background: #f3f4f6; border-radius: 18px; border-bottom-left-radius: 6px; }',
      '.edx-typing-dot { width: 8px; height: 8px; background: #9ca3af; border-radius: 50%; animation: edx-typing-dot 1.4s ease-in-out infinite; }',
      '.edx-typing-dot:nth-child(2) { animation-delay: 0.2s; }',
      '.edx-typing-dot:nth-child(3) { animation-delay: 0.4s; }',
      '.edx-suggestions { display: flex; flex-direction: column; gap: 6px; padding: 4px 20px 12px; flex-shrink: 0; animation: edx-fade-in 0.4s ease; }',
      '.edx-suggestions-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; padding-left: 2px; }',
      '.edx-suggestions-list { display: flex; flex-wrap: wrap; gap: 6px; }',
      '.edx-suggest-btn { padding: 8px 14px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: white; color: #374151; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; animation: edx-suggestion-pop 0.3s ease backwards; display: flex; align-items: center; gap: 5px; line-height: 1.3; }',
      '.edx-suggest-btn:nth-child(1) { animation-delay: 0.05s; }',
      '.edx-suggest-btn:nth-child(2) { animation-delay: 0.12s; }',
      '.edx-suggest-btn:nth-child(3) { animation-delay: 0.19s; }',
      '.edx-suggest-btn:hover { border-color: #7c3aed; color: #7c3aed; background: #f5f3ff; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(124, 58, 237, 0.12); }',
      '.edx-suggest-btn:active { transform: scale(0.97); }',
      '.edx-suggest-btn .edx-suggest-arrow { opacity: 0; transition: opacity 0.2s; font-size: 11px; }',
      '.edx-suggest-btn:hover .edx-suggest-arrow { opacity: 1; }',
      '.edx-quick-replies { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 20px 12px; flex-shrink: 0; }',
      '.edx-quick-btn { padding: 10px 16px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: white; color: #374151; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; white-space: nowrap; animation: edx-suggestion-pop 0.3s ease backwards; }',
      '.edx-quick-btn:nth-child(1) { animation-delay: 0.1s; }',
      '.edx-quick-btn:nth-child(2) { animation-delay: 0.2s; }',
      '.edx-quick-btn:nth-child(3) { animation-delay: 0.3s; }',
      '.edx-quick-btn:nth-child(4) { animation-delay: 0.4s; }',
      '.edx-quick-btn:hover { border-color: #7c3aed; color: #7c3aed; background: #f5f3ff; }',
      '.edx-chat-input { padding: 12px 16px; border-top: 1px solid #f3f4f6; display: flex; align-items: center; gap: 8px; flex-shrink: 0; background: white; }',
      '.edx-chat-input input { flex: 1; border: 1.5px solid #e5e7eb; border-radius: 12px; padding: 10px 16px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s, box-shadow 0.2s; background: #fafafa; }',
      '.edx-chat-input input:focus { border-color: #7c3aed; background: white; box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.08); }',
      '.edx-chat-input input::placeholder { color: #9ca3af; }',
      '.edx-chat-send { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #7c3aed, #2563eb); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }',
      '.edx-chat-send:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3); }',
      '.edx-chat-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }',
      '.edx-chat-send svg { width: 18px; height: 18px; fill: white; }',
      '.edx-chat-inline .edx-chat-window { position: relative; bottom: auto; right: auto; width: 100%; height: 520px; max-width: 100%; display: flex; border-radius: 16px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.04); }',
      '.edx-chat-inline .edx-chat-trigger { display: none; }',
      '.edx-chat-branding { text-align: center; padding: 6px; font-size: 11px; color: #9ca3af; background: #fafafa; flex-shrink: 0; }',
      '.edx-chat-branding a { color: #7c3aed; text-decoration: none; font-weight: 500; }',
      '.edx-lead-toast { position: absolute; top: 70px; left: 16px; right: 16px; background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 600; text-align: center; z-index: 10; animation: edx-fade-in 0.3s ease; box-shadow: 0 4px 16px rgba(5, 150, 105, 0.3); }',
    ].join('\n');
    document.head.appendChild(style);

    // Create widget container
    const widget = document.createElement('div');
    widget.id = 'edx-chat-widget';

    // Build DOM safely
    var trigger = document.createElement('button');
    trigger.className = 'edx-chat-trigger';
    trigger.setAttribute('aria-label', 'Chat with AI assistant');
    trigger.title = 'Ask me anything about EdunodeX';

    var pulse = document.createElement('div');
    pulse.className = 'edx-pulse';
    trigger.appendChild(pulse);

    var triggerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    triggerSvg.setAttribute('viewBox', '0 0 24 24');
    var triggerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    triggerPath.setAttribute('d', 'M12 2C6.48 2 2 6.48 2 12c0 1.74.5 3.37 1.35 4.76L2 22l5.24-1.35C8.63 21.5 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm2.07-6.75l-.9.92C11.45 10.9 11 11.5 11 13h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H6c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z');
    triggerSvg.appendChild(triggerPath);
    trigger.appendChild(triggerSvg);
    widget.appendChild(trigger);

    // Chat window
    var chatWindow = document.createElement('div');
    chatWindow.className = 'edx-chat-window';

    // Header
    var header = document.createElement('div');
    header.className = 'edx-chat-header';

    var avatarDiv = document.createElement('div');
    avatarDiv.className = 'edx-chat-avatar';
    var avatarImg = document.createElement('img');
    avatarImg.src = 'https://edunodex.in/images/favicon.png';
    avatarImg.alt = 'EdunodeX AI';
    avatarImg.onerror = function() { this.parentElement.textContent = 'X'; };
    avatarDiv.appendChild(avatarImg);
    header.appendChild(avatarDiv);

    var headerInfo = document.createElement('div');
    headerInfo.className = 'edx-chat-header-info';
    var headerName = document.createElement('div');
    headerName.className = 'edx-chat-header-name';
    headerName.textContent = 'EdunodeX AI';
    headerInfo.appendChild(headerName);
    var headerStatus = document.createElement('div');
    headerStatus.className = 'edx-chat-header-status';
    headerStatus.textContent = 'Online now';
    headerInfo.appendChild(headerStatus);
    header.appendChild(headerInfo);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'edx-chat-close';
    closeBtn.setAttribute('aria-label', 'Close chat');
    var closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    closeSvg.setAttribute('viewBox', '0 0 24 24');
    var line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', '18'); line1.setAttribute('y1', '6');
    line1.setAttribute('x2', '6'); line1.setAttribute('y2', '18');
    var line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', '6'); line2.setAttribute('y1', '6');
    line2.setAttribute('x2', '18'); line2.setAttribute('y2', '18');
    closeSvg.appendChild(line1);
    closeSvg.appendChild(line2);
    closeBtn.appendChild(closeSvg);
    header.appendChild(closeBtn);
    chatWindow.appendChild(header);

    // Messages
    var messagesContainer = document.createElement('div');
    messagesContainer.className = 'edx-chat-messages';
    messagesContainer.id = 'edx-messages';
    chatWindow.appendChild(messagesContainer);

    // Suggestions
    var suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'edx-suggestions';
    suggestionsContainer.id = 'edx-suggestions';
    suggestionsContainer.style.display = 'none';
    chatWindow.appendChild(suggestionsContainer);

    // Quick replies
    var quickRepliesContainer = document.createElement('div');
    quickRepliesContainer.className = 'edx-quick-replies';
    quickRepliesContainer.id = 'edx-quick-replies';
    chatWindow.appendChild(quickRepliesContainer);

    // Input
    var inputContainer = document.createElement('div');
    inputContainer.className = 'edx-chat-input';
    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'edx-input';
    input.placeholder = 'Ask about pricing, features, demo...';
    input.maxLength = MAX_INPUT_LENGTH;
    input.autocomplete = 'off';
    inputContainer.appendChild(input);

    var sendBtn = document.createElement('button');
    sendBtn.className = 'edx-chat-send';
    sendBtn.id = 'edx-send';
    sendBtn.setAttribute('aria-label', 'Send message');
    var sendSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sendSvg.setAttribute('viewBox', '0 0 24 24');
    var sendPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    sendPath.setAttribute('d', 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z');
    sendSvg.appendChild(sendPath);
    sendBtn.appendChild(sendSvg);
    inputContainer.appendChild(sendBtn);
    chatWindow.appendChild(inputContainer);

    // Branding
    var branding = document.createElement('div');
    branding.className = 'edx-chat-branding';
    branding.textContent = 'Powered by ';
    var brandLink = document.createElement('a');
    brandLink.href = 'https://edunodex.in';
    brandLink.target = '_blank';
    brandLink.textContent = 'EdunodeX AI';
    branding.appendChild(brandLink);
    chatWindow.appendChild(branding);

    widget.appendChild(chatWindow);
    document.body.appendChild(widget);

    // --- Bind Events ---
    trigger.addEventListener('click', function () {
      isOpen = !isOpen;
      chatWindow.classList.toggle('edx-visible', isOpen);
      trigger.classList.toggle('edx-open', isOpen);
      if (isOpen) {
        input.focus();
        if (messageHistory.length === 0) {
          showWelcome();
        }
        scrollToBottom();
      }
    });

    closeBtn.addEventListener('click', function () {
      isOpen = false;
      chatWindow.classList.remove('edx-visible');
      trigger.classList.remove('edx-open');
    });

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // --- Inline mode support ---
    var inlineContainer = document.getElementById('edx-chat-inline');
    if (inlineContainer) {
      inlineContainer.classList.add('edx-chat-inline');
      inlineContainer.appendChild(chatWindow);
      chatWindow.classList.add('edx-visible');
      trigger.style.display = 'none';
      isOpen = true;
      if (messageHistory.length === 0) {
        showWelcome();
      }
    }

    // --- Functions ---
    function showWelcome() {
      addBotMessage("Hi! I'm **EdunodeX AI** \u2014 your guide to India's School OS.\n\nI can help you with pricing, features, or set up a free demo. What brings you here today?");
      showQuickReplies([
        { text: "What is EdunodeX?", icon: "\uD83D\uDCA1" },
        { text: "Show me pricing", icon: "\uD83D\uDCB0" },
        { text: "How does fee collection work?", icon: "\uD83D\uDCCA" },
        { text: "I want a free demo", icon: "\uD83C\uDFAF" },
      ]);
    }

    function showQuickReplies(options) {
      quickRepliesContainer.textContent = '';
      hideSuggestions();
      options.forEach(function (opt) {
        var btn = document.createElement('button');
        btn.className = 'edx-quick-btn';
        btn.textContent = (opt.icon ? opt.icon + ' ' : '') + opt.text;
        btn.addEventListener('click', function () {
          quickRepliesContainer.textContent = '';
          input.value = opt.text;
          sendMessage();
        });
        quickRepliesContainer.appendChild(btn);
      });
    }

    function showSuggestions(suggestions) {
      if (!suggestions || suggestions.length === 0) {
        hideSuggestions();
        return;
      }
      suggestionsContainer.textContent = '';
      suggestionsContainer.style.display = 'flex';

      var label = document.createElement('div');
      label.className = 'edx-suggestions-label';
      label.textContent = 'Suggested questions';
      suggestionsContainer.appendChild(label);

      var list = document.createElement('div');
      list.className = 'edx-suggestions-list';

      suggestions.forEach(function (text) {
        var btn = document.createElement('button');
        btn.className = 'edx-suggest-btn';
        btn.textContent = text;
        var arrow = document.createElement('span');
        arrow.className = 'edx-suggest-arrow';
        arrow.textContent = '\u2192';
        btn.appendChild(arrow);
        btn.addEventListener('click', function () {
          hideSuggestions();
          input.value = text;
          sendMessage();
        });
        list.appendChild(btn);
      });

      suggestionsContainer.appendChild(list);
    }

    function hideSuggestions() {
      suggestionsContainer.style.display = 'none';
      suggestionsContainer.textContent = '';
    }

    function formatMessage(text) {
      // Escape HTML first, then apply safe markdown formatting
      var escaped = escapeHtml(text);
      return escaped
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    }

    function createBotBubble(text) {
      var bubble = document.createElement('div');
      bubble.className = 'edx-msg-bubble';
      bubble.style.background = '#f3f4f6';
      bubble.style.color = '#1f2937';
      bubble.style.borderRadius = '18px';
      bubble.style.borderBottomLeftRadius = '6px';
      // formatMessage escapes HTML before applying safe markdown
      bubble.innerHTML = formatMessage(text);
      return bubble;
    }

    function createBotAvatar() {
      var avatar = document.createElement('div');
      avatar.className = 'edx-msg-bot-avatar';
      var img = document.createElement('img');
      img.src = 'https://edunodex.in/images/favicon.png';
      img.alt = 'X';
      img.onerror = function() { this.parentElement.textContent = 'X'; };
      avatar.appendChild(img);
      return avatar;
    }

    function addBotMessage(text) {
      var row = document.createElement('div');
      row.className = 'edx-msg-bot-row';
      row.appendChild(createBotAvatar());
      row.appendChild(createBotBubble(text));
      messagesContainer.appendChild(row);
      messageHistory.push({ role: 'assistant', content: text });
      saveSession();
      scrollToBottom();
    }

    function addBotMessageRestore(text) {
      var row = document.createElement('div');
      row.className = 'edx-msg-bot-row';
      row.appendChild(createBotAvatar());
      row.appendChild(createBotBubble(text));
      messagesContainer.appendChild(row);
    }

    function addUserMessage(text) {
      var div = document.createElement('div');
      div.className = 'edx-msg edx-msg-user';
      var bubble = document.createElement('div');
      bubble.className = 'edx-msg-bubble';
      bubble.innerHTML = formatMessage(text);
      div.appendChild(bubble);
      messagesContainer.appendChild(div);
      messageHistory.push({ role: 'user', content: text });
      saveSession();
      scrollToBottom();
    }

    function addUserMessageRestore(text) {
      var div = document.createElement('div');
      div.className = 'edx-msg edx-msg-user';
      var bubble = document.createElement('div');
      bubble.className = 'edx-msg-bubble';
      bubble.innerHTML = formatMessage(text);
      div.appendChild(bubble);
      messagesContainer.appendChild(div);
    }

    function showTyping() {
      var row = document.createElement('div');
      row.className = 'edx-typing-row';
      row.id = 'edx-typing';
      row.appendChild(createBotAvatar());

      var dots = document.createElement('div');
      dots.className = 'edx-typing';
      for (var i = 0; i < 3; i++) {
        var dot = document.createElement('div');
        dot.className = 'edx-typing-dot';
        dots.appendChild(dot);
      }
      row.appendChild(dots);
      messagesContainer.appendChild(row);
      scrollToBottom();
    }

    function hideTyping() {
      var el = document.getElementById('edx-typing');
      if (el) el.remove();
    }

    function showLeadToast() {
      var toast = document.createElement('div');
      toast.className = 'edx-lead-toast';
      toast.textContent = '\u2705 Thanks! Our team will reach out to you shortly.';
      chatWindow.appendChild(toast);
      setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(function() { toast.remove(); }, 500);
      }, 4000);
    }

    function scrollToBottom() {
      setTimeout(function () {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 50);
    }

    async function sendMessage() {
      var text = input.value.trim();
      if (!text || isLoading) return;

      input.value = '';
      quickRepliesContainer.textContent = '';
      hideSuggestions();
      addUserMessage(text);
      showTyping();
      isLoading = true;
      sendBtn.disabled = true;

      try {
        var body = {
          message: text,
          session_id: sessionId,
        };

        // Add UTM on first message
        if (!sessionId) {
          var utm = getUtmParams();
          if (utm.utm_source) body.utm_source = utm.utm_source;
          if (utm.utm_medium) body.utm_medium = utm.utm_medium;
          if (utm.utm_campaign) body.utm_campaign = utm.utm_campaign;
        }

        var resp = await fetch(API_BASE + '/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        hideTyping();

        if (!resp.ok) {
          if (resp.status === 429) {
            addBotMessage("I'm getting a lot of questions right now! Please wait a moment and try again, or call us directly at **7880170555**.");
          } else {
            throw new Error('API error');
          }
          return;
        }

        var data = await resp.json();
        sessionId = data.session_id;
        addBotMessage(data.reply);
        saveSession();

        // Show suggested follow-up questions
        if (data.suggestions && data.suggestions.length > 0) {
          showSuggestions(data.suggestions);
        }

        // Fire conversion event if lead was collected
        if (data.lead_collected) {
          showLeadToast();
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
        addBotMessage("I'm having a brief connection issue. You can reach our team directly at **7880170555** or sign up at **in1.edunodex.in/signup**.");
        // Show fallback suggestions on error
        showSuggestions(["Try asking again", "Show me pricing", "I want a demo"]);
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
      } catch (e) { /* quota exceeded, ignore */ }
    }

    // Restore previous messages (without pushing to messageHistory again)
    if (messageHistory.length > 0) {
      var savedMessages = messageHistory.slice();
      messageHistory = [];
      savedMessages.forEach(function (msg) {
        if (msg.role === 'assistant') {
          addBotMessageRestore(msg.content);
        } else {
          addUserMessageRestore(msg.content);
        }
      });
      messageHistory = savedMessages;
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
