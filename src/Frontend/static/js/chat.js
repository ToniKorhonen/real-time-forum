import { getSocket } from "./websocket.js";

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
            
            // When clicking on a user, open chat and fetch past messages
            listItem.onclick = () => {
                openChat(userData.Username, username);
                fetchPastMessages(userData.Username, username);
            };
            
            listItem.classList.add("online-user");
            usersList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching online users:", error);
    }

    onlineUsersContainer.appendChild(usersList);
    // Prepend to the body so it's at the very top of the document
    const navBar = document.getElementById("nav-bar");
    navBar.insertAdjacentElement("afterend", onlineUsersContainer);
}


function openChat(sender, receiver) {
    if (sender === receiver) {
        console.log("You can't chat with yourself!");
        return;
    }
    
    console.log(`Opening chat with ${receiver}`);
    
    // Check if chat window already exists
    if (document.getElementById(`chat-window-${receiver}`)) {
        console.log("Chat window already exists");
        // Focus on the existing window instead
        document.getElementById(`chat-window-${receiver}`).style.zIndex = "1001"; // Bring to front
        document.getElementById(`chat-message-${receiver}`).focus();
        return;
    }
    
    // Create chat window
    const chatWindow = document.createElement("div");
    chatWindow.id = `chat-window-${receiver}`;
    chatWindow.innerHTML = `
        <div class="chat-header" style="display:flex; justify-content:space-between; padding:5px;">
            <h3>Chat with ${receiver}</h3>
            <button id="close-chat-${receiver}" style="cursor:pointer;">×</button>
        </div>
        <div id="chat-messages-${receiver}" class="chat-messages" style="flex-grow:1; overflow-y:auto; border-bottom:1px solid #ccc;"></div>
        <form id="chat-form-${receiver}" style="display:flex;">
          <input type="text" id="chat-message-${receiver}" required style="flex-grow:1;"/>
          <button type="submit">Send</button>
        </form>
    `;
    
    // Style the chat window
    chatWindow.style.position = "fixed";
    chatWindow.style.bottom = "0";
    chatWindow.style.right = "0";
    chatWindow.style.width = "300px";
    chatWindow.style.height = "350px";
    chatWindow.style.border = "1px solid black";
    chatWindow.style.backgroundColor = "white";
    chatWindow.style.overflow = "hidden";
    chatWindow.style.display = "flex";
    chatWindow.style.flexDirection = "column";
    chatWindow.style.padding = "10px";
    chatWindow.style.zIndex = "1000";
    chatWindow.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";

    const content = document.getElementById("content");
    content.appendChild(chatWindow);
    
    // Add close button functionality
    document.getElementById(`close-chat-${receiver}`).addEventListener("click", () => {
        chatWindow.remove();
    });
    
    // Set up form submission
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

        // Send message over WebSocket
        const socket = getSocket();
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(msgObj));
        } else {
            console.error("WebSocket is not connected");
        }

        // Clear input
        chatInput.value = "";
    });
    
    // Focus on the input field
    chatInput.focus();
}

// Fetch past messages between two users
async function fetchPastMessages(currentUser, otherUser) {
    try {
        const response = await fetch(`/api/messages?user=${otherUser}`);
        if (!response.ok) {
            throw new Error("Failed to fetch messages");
        }
        
        const messages = await response.json();
        
        // Display messages in the chat window
        const chatMessages = document.getElementById(`chat-messages-${otherUser}`);
        if (!chatMessages) return;
        
        // Clear existing messages (in case this is a refresh)
        chatMessages.innerHTML = "";
        
        // Set up for displaying messages properly
        chatMessages.style.display = "flex";
        chatMessages.style.flexDirection = "column";
        
        // Display messages in chronological order
        messages.forEach(msg => {
            if ((msg.senderID === currentUser && msg.receiverID === otherUser) || 
                (msg.senderID === otherUser && msg.receiverID === currentUser)) {
                displayChatMessage(msg, currentUser);
            }
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
    } catch (error) {
        console.error("Error fetching past messages:", error);
    }
}

// Display a chat message
function displayChatMessage(msg, currentUsername) {
    // Determine if current user is the sender
    const isSender = msg.senderID === currentUsername;
    
    // Determine who we're chatting with
    const chatPartner = isSender ? msg.receiverID : msg.senderID;
    
    // Get or create the chat window
    let chatMessages = document.getElementById(`chat-messages-${chatPartner}`);
    
    // If chat window doesn't exist, create it
    if (!chatMessages) {
        openChat(currentUsername, chatPartner);
        chatMessages = document.getElementById(`chat-messages-${chatPartner}`);
    }
    
    // Create the message element
    const messageDiv = document.createElement("div");
    messageDiv.textContent = `${isSender ? "You" : msg.senderID}: ${msg.content}`;
    messageDiv.style.padding = "8px";
    messageDiv.style.borderRadius = "10px";
    messageDiv.style.marginBottom = "8px";
    messageDiv.style.maxWidth = "80%";
    messageDiv.style.wordWrap = "break-word";
    
    // Style based on sender/receiver
    if (isSender) {
        messageDiv.style.alignSelf = "flex-end";
        messageDiv.style.backgroundColor = "#dcf8c6"; // Light green for sent messages
        messageDiv.style.marginLeft = "auto";
        messageDiv.style.borderBottomRightRadius = "2px";
    } else {
        messageDiv.style.alignSelf = "flex-start";
        messageDiv.style.backgroundColor = "#ececec"; // Light gray for received messages
        messageDiv.style.marginRight = "auto";
        messageDiv.style.borderBottomLeftRadius = "2px";
    }
    
    // Set the parent container to use flexbox if not already set
    if (chatMessages.style.display !== "flex") {
        chatMessages.style.display = "flex";
        chatMessages.style.flexDirection = "column";
    }
    
    // Append and scroll
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

export { usersOnline, displayChatMessage };