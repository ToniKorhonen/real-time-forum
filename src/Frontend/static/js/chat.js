import { getSocket } from "./websocket.js";

async function usersOnline(userData) {
    const content = document.getElementById("content");
    const onlineUsersContainer = document.createElement("div");
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
            listItem.onclick = () => openChat(userData.Username, username); // Pass sender + receiver
            listItem.classList.add("online-user");
            usersList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching online users:", error);
    }

    onlineUsersContainer.appendChild(usersList);
    content.appendChild(onlineUsersContainer);
}


function openChat(sender, receiver) {
    if (sender === receiver) {
        console.log("You can't chat with yourself!");
        return;
    }
    console.log(`Opening chat with ${receiver}`);
    // Open chat window
    const chatWindow = document.createElement("div");
    chatWindow.id = "chat-window";
    chatWindow.innerHTML = `
    <h3>Chat with ${receiver}</h3>
    <div id="chat-messages-${receiver}" class="chat-messages" style="flex-grow:1; overflow-y:auto; border-bottom:1px solid #ccc;"></div>
    <form id="chat-form-${receiver}" style="display:flex;">
      <input type="text" id="chat-message-${receiver}" required style="flex-grow:1;"/>
      <button type="submit">Send</button>
    </form>
  `;
    chatWindow.style.position = "fixed";
    chatWindow.style.bottom = "0";
    chatWindow.style.right = "0";
    chatWindow.style.width = "300px";
    chatWindow.style.height = "300px";
    chatWindow.style.border = "1px solid black";
    chatWindow.style.backgroundColor = "white";
    chatWindow.style.overflow = "auto";
    chatWindow.style.display = "flex";
    chatWindow.style.flexDirection = "column";
    chatWindow.style.padding = "10px";
    chatWindow.style.zIndex = "1000";


    
    const content = document.getElementById("content")
    content.appendChild(chatWindow);
    console.log(sender, receiver)
    
    const chatForm = document.getElementById(`chat-form-${receiver}`);
    const chatInput = document.getElementById(`chat-message-${receiver}`);
    
    chatForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page reload
        
        const message = chatInput.value.trim();
        if (!message) return;
        console.log(message)

        const msgObj = {
            senderID: sender,
            receiverID: receiver,
            content: message,
            timestamp: new Date().toISOString()
        };

        console.log(msgObj);
        // Send message over WebSocket
        const socket = getSocket();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(msgObj));
        } else {
            console.error("WebSocket is not connected");
        }

        // Display sent message immediately
        displayChatMessage(msgObj, receiver, true);

        // Clear input
        chatInput.value = "";
    });

    
}

function displayChatMessage(msg, receiver, isSender = false) {
    let chatMessages = document.getElementById(`chat-messages-${receiver}`);

    // If chat window doesn't exist, open it
    if (!chatMessages) {
        openChat(msg.senderID, msg.receiverID);
        chatMessages = document.getElementById(`chat-messages-${receiver}`);
    }

    

    const message = document.createElement("div");
    message.textContent = `${isSender ? "You" : msg.senderID}: ${msg.content}`;
    message.style.padding = "5px";
    message.style.borderRadius = "5px";
    message.style.marginBottom = "5px";
    message.style.alignSelf = isSender ? "flex-end" : "flex-start";
    message.style.backgroundColor = isSender ? "#dcf8c6" : "#ececec";

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}




export { usersOnline };