import { chatState, getCurrentUsername } from "./chatState.js";
import { openChat } from "./openChat.js";
import { getSocket } from "./websocket.js";

const notificationSound = new Audio('../assets/notification.mp3');

export function createNotificationsContainer() {
    let container = document.getElementById("notifications-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "notifications-container";
        Object.assign(container.style, {
            position: "fixed", bottom: "20px", right: "20px", zIndex: "2000"
        });
        document.body.appendChild(container);
    }
    return container;
}

// Inline helper for checking if chat window is open
function isChatOpen(username) {
    return !!document.getElementById(`chat-window-${username}`);
}

export function initializeNotifications() {
    const socket = getSocket();
    if (!socket) return;

    const originalOnMessage = socket.onmessage;

    socket.onmessage = function (event) {
        if (originalOnMessage) {
            originalOnMessage.call(socket, event);
        }

        try {
            const data = JSON.parse(event.data);
            if (data.type === "message" && data.senderID !== getCurrentUsername()) {
                if (!isChatOpen(data.senderID)) {
                    addNotification(data.senderID, data.content);
                }
            }
        } catch (e) {
            console.error("Error processing WebSocket message:", e);
        }
    };
}

export function createToastNotification(sender, message) {
    const container = createNotificationsContainer();
    const toast = document.createElement("div");
    Object.assign(toast.style, {
        backgroundColor: "rgba(0,0,0,0.8)", color: "white", padding: "12px 20px",
        borderRadius: "5px", marginBottom: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        cursor: "pointer", maxWidth: "300px", wordBreak: "break-word"
    });
    toast.innerHTML = `<div style="font-weight:bold;margin-bottom:5px;">New message from ${sender}</div>
                       <div>${message.length > 50 ? message.slice(0, 50) + "..." : message}</div>`;
    toast.addEventListener("click", () => {
        openChat(getCurrentUsername(), sender);
        clearNotifications(sender);
        toast.remove();
    });
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

export function addNotification(sender, message) {
    const badge = document.getElementById(`notification-badge-${sender}`);
    if (badge) {
        badge.style.display = "inline-block";
        badge.textContent = (parseInt(badge.textContent) || 0) + 1;
    }

    if (!chatState[sender]) {
        chatState[sender] = { messages: [], unreadCount: 1, isLoading: false, topOffset: 0, total: 0 };
    } else {
        chatState[sender].unreadCount++;
    }

    createToastNotification(sender, message);
    notificationSound.play().catch(() => {});
}

export function clearNotifications(username) {
    const badge = document.getElementById(`notification-badge-${username}`);
    if (badge) {
        badge.style.display = "none";
        badge.textContent = "0";
    }
    if (chatState[username]) chatState[username].unreadCount = 0;
}
