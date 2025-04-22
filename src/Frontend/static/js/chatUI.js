
import { openChat } from "./openChat.js";
import { addNotification, clearNotifications } from "./chatNotifications.js";
import { chatState } from "./chatState.js";


export function createChatMessageElement(msg, currentUsername) {
    const isSender = msg.senderID === currentUsername;
    const messageDiv = document.createElement("div");
    messageDiv.textContent = `${isSender ? "You" : msg.senderID}: ${msg.content}`;
    messageDiv.style.padding = "8px";
    messageDiv.style.borderRadius = "10px";
    messageDiv.style.marginBottom = "8px";
    messageDiv.style.maxWidth = "80%";
    messageDiv.style.wordWrap = "break-word";
    messageDiv.style.alignSelf = isSender ? "flex-end" : "flex-start";
    messageDiv.style.backgroundColor = isSender ? "#dcf8c6" : "#ececec";
    messageDiv.style.marginLeft = isSender ? "auto" : "";
    messageDiv.style.marginRight = !isSender ? "auto" : "";
    return messageDiv;
}

export function renderMessages(messages, currentUser, container) {
    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    messages.forEach(msg => {
        const div = createChatMessageElement(msg, currentUser);
        container.appendChild(div);
    });
    container.scrollTop = container.scrollHeight;
}
export async function usersOnline(userData) {
    const oldWrapper = document.getElementById("top-left-wrapper");
    if (oldWrapper) oldWrapper.remove();

    let wrapper = document.getElementById("top-left-wrapper");
    if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = "top-left-wrapper";
        document.body.prepend(wrapper);
    }

    const onlineUsersContainer = document.createElement("div");
    onlineUsersContainer.id = "online-users-container";

    const titleWrapper = document.createElement("div");
    titleWrapper.classList.add("users-title-wrapper");

    const img = document.createElement("img");
    img.src = "/static/assets/users.png";
    img.alt = "Users Icon";
    img.classList.add("users-icon");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = "Users Online";
    nameSpan.classList.add("user-label");

    titleWrapper.appendChild(img);
    titleWrapper.appendChild(nameSpan);
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
}

export function displayChatMessage(msg, currentUsername) {
    const isSender = msg.senderID === currentUsername;
    const chatPartner = isSender ? msg.receiverID : msg.senderID;

    if (chatState[chatPartner]) {
        chatState[chatPartner].messages.push(msg);
    }

    if (!isSender && !document.getElementById(`chat-window-${chatPartner}`)) {
        addNotification(chatPartner, msg.content);
    }

    const chatMessages = document.getElementById(`chat-messages-${chatPartner}`);
    if (!chatMessages) return;

    const messageDiv = document.createElement("div");
    messageDiv.textContent = `${isSender ? "You" : msg.senderID}: ${msg.content}`;
    Object.assign(messageDiv.style, {
        padding: "8px",
        borderRadius: "10px",
        marginBottom: "8px",
        maxWidth: "80%",
        wordWrap: "break-word",
        backgroundColor: isSender ? "#dcf8c6" : "#ececec",
        alignSelf: isSender ? "flex-end" : "flex-start",
        marginLeft: isSender ? "auto" : "",
        marginRight: !isSender ? "auto" : "",
    });

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
