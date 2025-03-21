let socket;

function initWebSocket(userData) {
    socket = new WebSocket(`ws://${window.location.host}/ws`);

    socket.onopen = () => {
        console.log(`WebSocket connected for ${userData.Username}`);
    };

    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const isSender = msg.senderID === userData.Username;
        const chatPartner = isSender ? msg.receiverID : msg.senderID;
        
        // Ensure the correct chat window is used
        displayMessage(msg, chatPartner, isSender);
    };

    socket.onclose = () => console.log("WebSocket connection closed");
    socket.onerror = (error) => console.log("WebSocket error", error);
}

function getSocket() {
    return socket; 
}



function displayMessage(msg) {
    const chatMessages = document.getElementById("chat-messages");
    const message = document.createElement("div");
    message.textContent = msg.message;
    chatMessages.appendChild(message);;
}


export { initWebSocket, getSocket };