import { getSocket } from "./websocket.js";

const pageSize = 10;
const chatState = {}; // { [receiverID]: { offset, total, messages, isLoading } }

async function usersOnline(userData) {
    const onlineUsersContainer = document.createElement("div");
    onlineUsersContainer.id = "online-users-container";
    onlineUsersContainer.innerHTML = `<h3>Users Online</h3>`;

    const usersList = document.createElement("ul");
    usersList.id = "users-online";

    try {
        const response = await fetch("/api/online-users");
        if (!response.ok) throw new Error("Failed to fetch online users");

        const onlineUsers = await response.json();

        onlineUsers.forEach(username => {
            const listItem = document.createElement("li");
            listItem.textContent = username;
            listItem.style.cursor = "pointer";

            listItem.onclick = () => {
                openChat(userData.Username, username);
            };

            listItem.classList.add("online-user");
            usersList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching online users:", error);
    }

    onlineUsersContainer.appendChild(usersList);
    const navBar = document.getElementById("nav-bar");
    navBar.insertAdjacentElement("afterend", onlineUsersContainer);
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

async function openChat(sender, receiver) {
    if (sender === receiver) return;

    const existing = document.getElementById(`chat-window-${receiver}`);
    if (existing) {
        existing.style.zIndex = "1001";
        document.getElementById(`chat-message-${receiver}`).focus();
        return;
    }

    const chatWindow = document.createElement("div");
    chatWindow.id = `chat-window-${receiver}`;
    chatWindow.innerHTML = `
      <div class="chat-header" style="display:flex; justify-content:space-between; padding:5px;">
        <h3>Chat with ${receiver}</h3>
        <button id="close-chat-${receiver}" style="cursor:pointer;">×</button>
      </div>
      <div id="chat-messages-${receiver}" class="chat-messages" style="flex-grow:1; overflow-y:auto; border-bottom:1px solid #ccc;"></div>
      <form id="chat-form-${receiver}" style="display:flex;">
        <input type="text" id="chat-message-${receiver}" required style="flex-grow:1;" />
        <button type="submit">Send</button>
      </form>
    `;

    Object.assign(chatWindow.style, {
        position: "fixed",
        bottom: "0",
        right: "0",
        width: "400px",
        height: "450px",
        border: "1px solid black",
        backgroundColor: "white",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        zIndex: "1000",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)"
    });

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
    };

    renderMessages(receiver, sender);

    const chatMessages = document.getElementById(`chat-messages-${receiver}`);

    chatMessages.addEventListener("scroll", throttle(async () => {
        const state = chatState[receiver];
        const atTop = chatMessages.scrollTop <= 5;
    
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
    }, 300));    
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


export { usersOnline, displayChatMessage };