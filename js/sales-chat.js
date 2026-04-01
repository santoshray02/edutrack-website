/**
 * EdunodeX AI Sales Chat Widget
 * A modern, conversational AI chatbot for lead generation.
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

  // --- Build Widget DOM ---
  function createWidget() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes edx-slide-up {
        from { opacity: 0; transform: translateY(20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes edx-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes edx-typing-dot {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-6px); }
      }
      @keyframes edx-pulse-ring {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.4); opacity: 0; }
      }

      #edx-chat-widget {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
      }
      @media (max-width: 768px) {
        #edx-chat-widget { bottom: 80px; right: 12px; }
      }

      /* --- Trigger Button --- */
      .edx-chat-trigger {
        width: 64px; height: 64px;
        border-radius: 50%;
        background: linear-gradient(135deg, #7c3aed, #2563eb);
        border: none;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 8px 32px rgba(124, 58, 237, 0.4);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      }
      .edx-chat-trigger:hover {
        transform: scale(1.08);
        box-shadow: 0 12px 40px rgba(124, 58, 237, 0.5);
      }
      .edx-chat-trigger svg { width: 28px; height: 28px; fill: white; }
      .edx-chat-trigger .edx-pulse {
        position: absolute; inset: -4px;
        border-radius: 50%;
        border: 2px solid rgba(124, 58, 237, 0.6);
        animation: edx-pulse-ring 2s ease-out infinite;
      }
      .edx-chat-trigger.edx-open .edx-pulse { display: none; }

      /* --- Chat Window --- */
      .edx-chat-window {
        display: none;
        position: absolute;
        bottom: 76px;
        right: 0;
        width: 400px;
        max-width: calc(100vw - 24px);
        height: 560px;
        max-height: calc(100vh - 140px);
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
        flex-direction: column;
        overflow: hidden;
        animation: edx-slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .edx-chat-window.edx-visible { display: flex; }
      @media (max-width: 480px) {
        .edx-chat-window {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100%; height: 100%;
          max-width: 100%; max-height: 100%;
          border-radius: 0;
          bottom: auto;
        }
      }

      /* --- Header --- */
      .edx-chat-header {
        background: linear-gradient(135deg, #7c3aed, #2563eb);
        padding: 16px 20px;
        display: flex; align-items: center; gap: 12px;
        flex-shrink: 0;
      }
      .edx-chat-avatar {
        width: 40px; height: 40px;
        border-radius: 12px;
        background: rgba(255,255,255,0.2);
        display: flex; align-items: center; justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
      }
      .edx-chat-header-info { flex: 1; }
      .edx-chat-header-name {
        color: white; font-weight: 700; font-size: 15px; line-height: 1.2;
      }
      .edx-chat-header-status {
        color: rgba(255,255,255,0.8); font-size: 12px;
        display: flex; align-items: center; gap: 6px;
      }
      .edx-chat-header-status::before {
        content: '';
        width: 7px; height: 7px;
        background: #34d399;
        border-radius: 50%;
        display: inline-block;
      }
      .edx-chat-close {
        background: rgba(255,255,255,0.15);
        border: none; cursor: pointer;
        border-radius: 10px;
        width: 36px; height: 36px;
        display: flex; align-items: center; justify-content: center;
        transition: background 0.2s;
      }
      .edx-chat-close:hover { background: rgba(255,255,255,0.25); }
      .edx-chat-close svg { width: 18px; height: 18px; stroke: white; fill: none; stroke-width: 2; }

      /* --- Messages --- */
      .edx-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        scroll-behavior: smooth;
      }
      .edx-chat-messages::-webkit-scrollbar { width: 4px; }
      .edx-chat-messages::-webkit-scrollbar-track { background: transparent; }
      .edx-chat-messages::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }

      .edx-msg {
        max-width: 85%;
        animation: edx-fade-in 0.3s ease;
      }
      .edx-msg-bot {
        align-self: flex-start;
      }
      .edx-msg-user {
        align-self: flex-end;
      }
      .edx-msg-bubble {
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.5;
        word-break: break-word;
      }
      .edx-msg-bot .edx-msg-bubble {
        background: #f3f4f6;
        color: #1f2937;
        border-bottom-left-radius: 4px;
      }
      .edx-msg-user .edx-msg-bubble {
        background: linear-gradient(135deg, #7c3aed, #2563eb);
        color: white;
        border-bottom-right-radius: 4px;
      }

      /* Typing indicator */
      .edx-typing {
        display: flex; gap: 5px;
        padding: 14px 18px;
        align-self: flex-start;
        background: #f3f4f6;
        border-radius: 16px;
        border-bottom-left-radius: 4px;
      }
      .edx-typing-dot {
        width: 8px; height: 8px;
        background: #9ca3af;
        border-radius: 50%;
        animation: edx-typing-dot 1.4s ease-in-out infinite;
      }
      .edx-typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .edx-typing-dot:nth-child(3) { animation-delay: 0.4s; }

      /* Quick replies */
      .edx-quick-replies {
        display: flex; flex-wrap: wrap; gap: 8px;
        padding: 0 20px 12px;
        flex-shrink: 0;
      }
      .edx-quick-btn {
        padding: 8px 16px;
        border-radius: 20px;
        border: 1.5px solid #e5e7eb;
        background: white;
        color: #374151;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
      }
      .edx-quick-btn:hover {
        border-color: #7c3aed;
        color: #7c3aed;
        background: #f5f3ff;
      }

      /* --- Input --- */
      .edx-chat-input {
        padding: 12px 16px;
        border-top: 1px solid #f3f4f6;
        display: flex; align-items: center; gap: 8px;
        flex-shrink: 0;
        background: white;
      }
      .edx-chat-input input {
        flex: 1;
        border: 1.5px solid #e5e7eb;
        border-radius: 12px;
        padding: 10px 16px;
        font-size: 14px;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s;
        background: #fafafa;
      }
      .edx-chat-input input:focus {
        border-color: #7c3aed;
        background: white;
      }
      .edx-chat-input input::placeholder { color: #9ca3af; }
      .edx-chat-send {
        width: 40px; height: 40px;
        border-radius: 12px;
        background: linear-gradient(135deg, #7c3aed, #2563eb);
        border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
      }
      .edx-chat-send:hover { transform: scale(1.05); }
      .edx-chat-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
      .edx-chat-send svg { width: 18px; height: 18px; fill: white; }

      /* --- Inline embedded mode --- */
      .edx-chat-inline .edx-chat-window {
        position: relative;
        bottom: auto; right: auto;
        width: 100%;
        height: 500px;
        max-width: 100%;
        display: flex;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.04);
      }
      .edx-chat-inline .edx-chat-trigger { display: none; }

      /* --- Branding --- */
      .edx-chat-branding {
        text-align: center;
        padding: 6px;
        font-size: 11px;
        color: #9ca3af;
        background: #fafafa;
        flex-shrink: 0;
      }
      .edx-chat-branding a { color: #7c3aed; text-decoration: none; }
    `;
    document.head.appendChild(style);

    // Create widget container
    const widget = document.createElement('div');
    widget.id = 'edx-chat-widget';
    widget.innerHTML = `
      <button class="edx-chat-trigger" aria-label="Chat with AI assistant" title="Ask me anything about EdunodeX">
        <div class="edx-pulse"></div>
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.74.5 3.37 1.35 4.76L2 22l5.24-1.35C8.63 21.5 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm2.07-6.75l-.9.92C11.45 10.9 11 11.5 11 13h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H6c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
      </button>
      <div class="edx-chat-window">
        <div class="edx-chat-header">
          <div class="edx-chat-avatar">
            <img src="https://edunodex.in/images/favicon.png" alt="Xena" style="width:28px;height:28px;border-radius:6px;" onerror="this.parentElement.textContent='X'">
          </div>
          <div class="edx-chat-header-info">
            <div class="edx-chat-header-name">Xena — EdunodeX AI</div>
            <div class="edx-chat-header-status">Online now</div>
          </div>
          <button class="edx-chat-close" aria-label="Close chat">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="edx-chat-messages" id="edx-messages"></div>
        <div class="edx-quick-replies" id="edx-quick-replies"></div>
        <div class="edx-chat-input">
          <input type="text" id="edx-input" placeholder="Type your message..." maxlength="${MAX_INPUT_LENGTH}" autocomplete="off">
          <button class="edx-chat-send" id="edx-send" aria-label="Send message">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
        <div class="edx-chat-branding">Powered by <a href="https://edunodex.in" target="_blank">Xentovia AI</a></div>
      </div>
    `;
    document.body.appendChild(widget);

    // --- Bind Events ---
    const trigger = widget.querySelector('.edx-chat-trigger');
    const chatWindow = widget.querySelector('.edx-chat-window');
    const closeBtn = widget.querySelector('.edx-chat-close');
    const input = document.getElementById('edx-input');
    const sendBtn = document.getElementById('edx-send');
    const messagesContainer = document.getElementById('edx-messages');
    const quickRepliesContainer = document.getElementById('edx-quick-replies');

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
    // If there's an element with id="edx-chat-inline", move the chat window there
    const inlineContainer = document.getElementById('edx-chat-inline');
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
      addBotMessage("Hi! I'm Xena, your AI guide to EdunodeX. I can answer questions about pricing, features, and how our School OS can help your school.\n\nWhat would you like to know?");
      showQuickReplies([
        "What is EdunodeX?",
        "Show me pricing",
        "How does fee collection work?",
        "I want a demo"
      ]);
    }

    function showQuickReplies(options) {
      quickRepliesContainer.innerHTML = '';
      options.forEach(function (text) {
        var btn = document.createElement('button');
        btn.className = 'edx-quick-btn';
        btn.textContent = text;
        btn.addEventListener('click', function () {
          quickRepliesContainer.innerHTML = '';
          input.value = text;
          sendMessage();
        });
        quickRepliesContainer.appendChild(btn);
      });
    }

    function addBotMessage(text) {
      var msg = createMessageEl('bot', text);
      messagesContainer.appendChild(msg);
      messageHistory.push({ role: 'assistant', content: text });
      saveSession();
      scrollToBottom();
    }

    function addUserMessage(text) {
      var msg = createMessageEl('user', text);
      messagesContainer.appendChild(msg);
      messageHistory.push({ role: 'user', content: text });
      saveSession();
      scrollToBottom();
    }

    function createMessageEl(type, text) {
      var div = document.createElement('div');
      div.className = 'edx-msg edx-msg-' + type;
      var bubble = document.createElement('div');
      bubble.className = 'edx-msg-bubble';
      // Simple markdown: **bold** and line breaks
      var html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      bubble.innerHTML = html;
      div.appendChild(bubble);
      return div;
    }

    function showTyping() {
      var div = document.createElement('div');
      div.className = 'edx-typing';
      div.id = 'edx-typing';
      div.innerHTML = '<div class="edx-typing-dot"></div><div class="edx-typing-dot"></div><div class="edx-typing-dot"></div>';
      messagesContainer.appendChild(div);
      scrollToBottom();
    }

    function hideTyping() {
      var el = document.getElementById('edx-typing');
      if (el) el.remove();
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
      quickRepliesContainer.innerHTML = '';
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

        // Fire conversion event if lead was collected
        if (data.lead_collected && typeof gtag === 'function') {
          gtag('event', 'generate_lead', {
            event_category: 'Sales Chat',
            event_label: 'AI Chatbot Lead',
            value: 1,
          });
          gtag('event', 'conversion', { send_to: 'AW-18055680778' });
        }

      } catch (err) {
        hideTyping();
        addBotMessage("I'm having a brief connection issue. You can reach our team directly at **7880170555** or try our **[Instant Preview](https://in1.edunodex.in/signup)**.");
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
          messages: messageHistory.slice(-40), // Keep last 40 messages
        }));
      } catch (e) { /* quota exceeded, ignore */ }
    }

    // Restore previous messages
    if (messageHistory.length > 0) {
      messageHistory.forEach(function (msg) {
        var el = createMessageEl(msg.role === 'assistant' ? 'bot' : 'user', msg.content);
        messagesContainer.appendChild(el);
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();
