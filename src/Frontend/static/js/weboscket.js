let socket

function initWebSocket(userID) {
    socket = new WebSocket(`ws://${window.location.host}/ws`); // Create a new WebSocket connection

    socket.onmessage = (event) => {
        const msg = JSON.parse(event.data); // Parse the JSON data
        displayMessage(msg); // Display the message
    };

    socket.onclose = (event) => {
        console.log("WebSocket connection closed", event);
    };

    socket.onerror = (error) => {
        console.log("WebSocket error", error);
    };
}

function sendMessage(senderID, receiverID, content) {
    const msg = {
        senderID: senderID,
        receiverID: receiverID,
        content: content
    };

    socket.send(JSON.stringify(msg)); // Send the message as JSON data
}

function displayMessage(msg) {
    const chat = document.getElementById("chat");
    const message = document.createElement("div");
    message.textContent = `${msg.senderID}: ${msg.content}`;
    chat.appendChild(message);
}

export { initWebSocket, sendMessage }; // Export the initWebSocket and sendMessage functions