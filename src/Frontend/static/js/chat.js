import { getSocket } from "./websocket.js";

const pageSize = 10;
const chatState = {}; // { [receiverID]: { offset, total, messages, isLoading, unreadCount } }
const notificationSound = new Audio('../assets/notification.mp3'); // Add a notification sound file to your project

// Create a notifications container
function createNotificationsContainer() {
    const container = document.createElement("div");
    container.id = "notifications-container";
    Object.assign(container.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: "2000"
    });
    document.body.appendChild(container);
    return container;
}

async function usersOnline(userData) {
    const oldWrapper = document.getElementById("top-left-wrapper");
    if (oldWrapper) {
        oldWrapper.remove(); // remove the whole thing
    }
    const header = document.getElementById("header");

    let wrapper = document.getElementById("top-left-wrapper");
    if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = "top-left-wrapper";
        document.body.prepend(wrapper);
    }

    // Create the actual container first
    const onlineUsersContainer = document.createElement("div");
    onlineUsersContainer.id = "online-users-container";
    
    const titleWrapper = document.createElement("div");
    titleWrapper.classList.add("users-title-wrapper");
    
    const img = document.createElement("img");
    img.src = "/static/assets/users.png";
    img.alt = "Users Icon";
    img.classList.add("users-icon");
    
    const nameSpan = document.createElement("span");
    nameSpan.textContent = "Users Online"; // or your custom text
    nameSpan.classList.add("user-label");
    
    titleWrapper.appendChild(img);
    titleWrapper.appendChild(nameSpan);

    // Add to the main container
    onlineUsersContainer.appendChild(titleWrapper);

    const usersList = document.createElement("ul");
    usersList.id = "users-online";

    try {
        const response = await fetch("/api/online-users");
        if (!response.ok) throw new Error("Failed to fetch online users");

        const onlineUsers = await response.json();
        onlineUsers.sort((a, b) => a.localeCompare(b));

        onlineUsers.forEach(username => {
            const listItem = document.createElement("li");
            listItem.classList.add("online-user");

            const usernameSpan = document.createElement("span");
            usernameSpan.textContent = username;

            const badge = document.createElement("span");
            badge.id = `notification-badge-${username}`;
            badge.classList.add("notification-badge");
            badge.style.display = "none";

            listItem.onclick = () => {
                openChat(userData.Username, username);
                clearNotifications(username);
            };

            listItem.appendChild(usernameSpan);
            listItem.appendChild(badge);
            usersList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching online users:", error);
    }

    onlineUsersContainer.appendChild(usersList);
    wrapper.appendChild(onlineUsersContainer);

    createNotificationsContainer();
}


function renderMessages(otherUser, currentUser) {
    const chatMessages = document.getElementById(`chat-messages-${otherUser}`);
    chatMessages.innerHTML = "";
    chatMessages.style.display = "flex";
    chatMessages.style.flexDirection = "column";

    const messages = chatState[otherUser].messages;

    messages.forEach(msg => {
        const div = createChatMessageElement(msg, currentUser);
        chatMessages.appendChild(div);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function isChatOpen(username) {
    const chatWindow = document.getElementById(`chat-window-${username}`);
    return chatWindow !== null;
}

function addNotification(sender, message) {
    // Update badge counter
    const badge = document.getElementById(`notification-badge-${sender}`);
    if (badge) {
        if (badge.style.display === "none") {
            badge.style.display = "inline-block";
            badge.textContent = "1";
        } else {
            badge.textContent = parseInt(badge.textContent) + 1;
        }
    }
    
    // Add to chat state
    if (chatState[sender]) {
        chatState[sender].unreadCount = (chatState[sender].unreadCount || 0) + 1;
    } else {
        chatState[sender] = { unreadCount: 1, messages: [], isLoading: false, topOffset: 0, total: 0 };
    }
    
    // Create toast notification
    createToastNotification(sender, message);
    
    // Play sound
    notificationSound.play().catch(err => console.log("Error playing notification sound:", err));
}

function createToastNotification(sender, message) {
    const container = document.getElementById("notifications-container") || createNotificationsContainer();
    
    const toast = document.createElement("div");
    Object.assign(toast.style, {
        backgroundColor: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "12px 20px",
        borderRadius: "5px",
        marginBottom: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        cursor: "pointer",
        maxWidth: "300px",
        wordBreak: "break-word"
    });
    
    const header = document.createElement("div");
    header.textContent = `New message from ${sender}`;
    header.style.fontWeight = "bold";
    header.style.marginBottom = "5px";
    
    const content = document.createElement("div");
    content.textContent = message.length > 50 ? message.substring(0, 50) + "..." : message;
    
    toast.appendChild(header);
    toast.appendChild(content);
    
    // Click to open chat
    toast.addEventListener("click", () => {
        openChat(getCurrentUsername(), sender);
        clearNotifications(sender);
        toast.remove();
    });
    
    container.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

function getCurrentUsername() {
    // You might need to adjust this based on how you're storing the current user info
    return document.querySelector('[data-current-user]')?.dataset.currentUser || "User";
}

function clearNotifications(username) {
    // Clear badge
    const badge = document.getElementById(`notification-badge-${username}`);
    if (badge) {
        badge.style.display = "none";
        badge.textContent = "0";
    }
    
    // Clear chat state counter
    if (chatState[username]) {
        chatState[username].unreadCount = 0;
    }
    
    // Update document title
    updateDocumentTitle();
}

function updateDocumentTitle() {
    // Calculate total unread messages
    let totalUnread = 0;
    Object.values(chatState).forEach(state => {
        totalUnread += state.unreadCount || 0;
    });
    
    // Update title
    if (totalUnread > 0) {
        document.title = `(${totalUnread}) Chat App`;
    } else {
        document.title = "Chat App";  // Replace with your actual app name
    }
}

async function openChat(sender, receiver) {
    if (sender === receiver) return;

    const existing = document.getElementById(`chat-window-${receiver}`);
    if (existing) {
        existing.style.zIndex = "1001";
        document.getElementById(`chat-message-${receiver}`).focus();
        clearNotifications(receiver);
        return;
    }

    const chatWindow = document.createElement("div");
    chatWindow.id = `chat-window-${receiver}`;
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

    chatWindow.classList.add("chat-window");

    document.getElementById("content").appendChild(chatWindow);

    document.getElementById(`close-chat-${receiver}`).addEventListener("click", () => {
        chatWindow.remove();
    });

    const chatForm = document.getElementById(`chat-form-${receiver}`);
    const chatInput = document.getElementById(`chat-message-${receiver}`);

    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const message = chatInput.value.trim();
        if (!message) return;

        const msgObj = {
            senderID: sender,
            receiverID: receiver,
            content: message,
            timestamp: new Date().toISOString()
        };

        const socket = getSocket();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(msgObj));
        } else {
            console.error("WebSocket is not connected");
        }

        chatInput.value = "";
    });

    chatInput.focus();

    const initialOffset = 0;
    const result = await fetchMessagesPage(sender, receiver, initialOffset);

    chatState[receiver] = {
        topOffset: initialOffset,
        total: result.total,
        messages: result.messages.reverse(), // make it oldest → newest
        isLoading: false,
        unreadCount: 0
    };

    renderMessages(receiver, sender);
    clearNotifications(receiver);  // Clear any pending notifications

    const chatMessages = document.getElementById(`chat-messages-${receiver}`);

    chatMessages.addEventListener("scroll", throttle(async () => {
        const state = chatState[receiver];
        const atTop = chatMessages.scrollTop <= 2;
    
        if (state.isLoading || !atTop || state.topOffset + pageSize >= state.total) return;
    
        console.log("🟢 Scrolled to top — fetching more messages...");
    
        state.isLoading = true;
        const newOffset = state.topOffset + pageSize;
        const result = await fetchMessagesPage(sender, receiver, newOffset);
        const prevHeight = chatMessages.scrollHeight;
    
        state.messages = [...result.messages.reverse(), ...state.messages];
        state.topOffset = newOffset;
    
        renderMessages(receiver, sender);
        await new Promise(requestAnimationFrame);
        chatMessages.scrollTop = chatMessages.scrollHeight - prevHeight;
        
        state.isLoading = false;
    }, 10));    
}

async function fetchMessagesPage(currentUser, otherUser, offset) {
    const response = await fetch(`/api/messages?user=${otherUser}&offset=${offset}&limit=${pageSize}`);
    if (!response.ok) throw new Error("Failed to fetch messages");

    const result = await response.json();
    const messages = result.messages
        .filter(
            msg =>
                (msg.senderID === currentUser && msg.receiverID === otherUser) ||
                (msg.senderID === otherUser && msg.receiverID === currentUser)
        ); // backend gives us DESC now, we reverse it on frontend

    return {
        messages,
        offset: result.offset,
        total: result.total,
    };
}

function displayChatMessage(msg, currentUsername) {
    const isSender = msg.senderID === currentUsername;
    const chatPartner = isSender ? msg.receiverID : msg.senderID;

    // Store in chat state if it exists
    if (chatState[chatPartner]) {
        chatState[chatPartner].messages.push(msg);
    }

    // If message is incoming and chat window is not open, show notification
    if (!isSender && !isChatOpen(chatPartner)) {
        addNotification(chatPartner, msg.content);
    }

    const chatMessages = document.getElementById(`chat-messages-${chatPartner}`);
    if (!chatMessages) return;

    const messageDiv = createChatMessageElement(msg, currentUsername);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createChatMessageElement(msg, currentUsername) {
    const isSender = msg.senderID === currentUsername;
    const messageDiv = document.createElement("div");

    messageDiv.textContent = `${isSender ? "You" : msg.senderID}: ${msg.content}`;
    messageDiv.style.padding = "8px";
    messageDiv.style.borderRadius = "10px";
    messageDiv.style.marginBottom = "8px";
    messageDiv.style.maxWidth = "80%";
    messageDiv.style.wordWrap = "break-word";

    if (isSender) {
        messageDiv.style.alignSelf = "flex-end";
        messageDiv.style.backgroundColor = "#dcf8c6";
        messageDiv.style.marginLeft = "auto";
    } else {
        messageDiv.style.alignSelf = "flex-start";
        messageDiv.style.backgroundColor = "#ececec";
        messageDiv.style.marginRight = "auto";
    }

    return messageDiv;
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

// Initialize notifications when websocket connects
function initializeNotifications() {
    const socket = getSocket();
    if (socket) {
        const originalOnMessage = socket.onmessage;
        
        socket.onmessage = function(event) {
            // Call the original handler if it exists
            if (originalOnMessage) {
                originalOnMessage.call(socket, event);
            }
            
            try {
                const data = JSON.parse(event.data);
                // If it's a chat message and not from current user
                if (data.type === 'message' && data.senderID !== getCurrentUsername()) {
                    // Handle notification
                    if (!isChatOpen(data.senderID)) {
                        addNotification(data.senderID, data.content);
                    }
                }
            } catch (e) {
                console.error("Error processing websocket message for notifications:", e);
            }
        };
    }
}

// Export the initializeNotifications function
export { usersOnline, displayChatMessage, initializeNotifications };