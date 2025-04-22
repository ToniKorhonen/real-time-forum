import { getSocket } from "./websocket.js";
import { chatState, getCurrentUsername } from "./chatState.js";
import { renderMessages } from "./chatUI.js";
import { fetchMessagesPage } from "./chatUtils.js";
import { clearNotifications } from "./chatNotifications.js";

export async function openChat(sender, receiver) {
    if (sender === receiver) return;

    if (focusIfChatExists(receiver)) return;

    createChatWindow(receiver);
    setupCloseButton(receiver);
    setupTypingEvents(sender, receiver);
    setupSendMessage(sender, receiver);
    await loadInitialMessages(sender, receiver);
    setupTypingIndicator(receiver);
    setupScrollPagination(sender, receiver);
}

function focusIfChatExists(receiver) {
    const existing = document.getElementById(`chat-window-${receiver}`);
    if (existing) {
        existing.style.zIndex = "1001";
        document.getElementById(`chat-message-${receiver}`).focus();
        clearNotifications(receiver);
        return true;
    }
    return false;
}

function createChatWindow(receiver) {
    const chatWindow = document.createElement("div");
    chatWindow.id = `chat-window-${receiver}`;
    chatWindow.classList.add("chat-window");
    chatWindow.innerHTML = `
        <div class="chat-header">
            <h3>Chat with ${receiver}</h3>
            <button id="close-chat-${receiver}" class="chat-close-btn">❌</button>
        </div>
        <div id="chat-messages-${receiver}" class="chat-messages"></div>
        <form id="chat-form-${receiver}" class="chat-form">
            <input type="text" id="chat-message-${receiver}" required class="chat-input" />
            <button type="submit" class="chat-send-btn">Send</button>
        </form>
    `;
    document.getElementById("content").appendChild(chatWindow);
}

function setupCloseButton(receiver) {
    document.getElementById(`close-chat-${receiver}`).onclick = () => {
        document.getElementById(`chat-window-${receiver}`)?.remove();
    };
}

function setupTypingEvents(sender, receiver) {
    const chatInput = document.getElementById(`chat-message-${receiver}`);
    let isTyping = false;
    let typingTimeout;

    chatInput.addEventListener("input", () => {
        const socket = getSocket();
        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        if (!isTyping) {
            isTyping = true;
            socket.send(JSON.stringify({ type: "typing", senderID: sender, receiverID: receiver, stop: false }));
        }

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            isTyping = false;
            socket.send(JSON.stringify({ type: "typing", senderID: sender, receiverID: receiver, stop: true }));
        }, 1000);
    });
}

function setupSendMessage(sender, receiver) {
    const chatForm = document.getElementById(`chat-form-${receiver}`);
    const chatInput = document.getElementById(`chat-message-${receiver}`);

    chatForm.onsubmit = (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        const socket = getSocket();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "chat",
                senderID: sender,
                receiverID: receiver,
                content: message,
                timestamp: new Date().toISOString()
            }));
        }

        chatInput.value = "";
    };

    chatInput.focus();
}

async function loadInitialMessages(sender, receiver) {
    const result = await fetchMessagesPage(sender, receiver, 0);

    chatState[receiver] = {
        topOffset: 0,
        total: result.total,
        messages: result.messages.reverse(),
        isLoading: false,
        unreadCount: 0
    };

    const chatMessages = document.getElementById(`chat-messages-${receiver}`);
    renderMessages(chatState[receiver].messages, sender, chatMessages);
    clearNotifications(receiver);
}

function setupTypingIndicator(receiver) {
    const chatMessages = document.getElementById(`chat-messages-${receiver}`);
    const typingIndicator = document.createElement("div");
    typingIndicator.id = `typing-indicator-${receiver}`;
    typingIndicator.className = "typing-indicator";
    typingIndicator.style.display = "none";
    typingIndicator.style.fontStyle = "italic";
    typingIndicator.style.color = "red";
    typingIndicator.style.marginTop = "4px";
    typingIndicator.textContent = `${receiver} is typing...`;
    typingIndicator.style.animation = "blink 1s infinite";
    chatMessages.after(typingIndicator);
}

function setupScrollPagination(sender, receiver) {
    const chatMessages = document.getElementById(`chat-messages-${receiver}`);

    chatMessages.addEventListener("scroll", throttle(async () => {
        const state = chatState[receiver];
        if (state.isLoading || chatMessages.scrollTop > 2 || state.topOffset + 10 >= state.total) return;

        state.isLoading = true;
        const newOffset = state.topOffset + 10;
        const result = await fetchMessagesPage(sender, receiver, newOffset);
        const prevHeight = chatMessages.scrollHeight;

        state.messages = [...result.messages.reverse(), ...state.messages];
        state.topOffset = newOffset;
        renderMessages(chatState[receiver].messages, sender, chatMessages);
        await new Promise(requestAnimationFrame);
        chatMessages.scrollTop = chatMessages.scrollHeight - prevHeight;
        state.isLoading = false;
    }, 10));
}

function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
