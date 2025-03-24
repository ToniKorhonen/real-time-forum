let socket;
let currentUserData;

function initWebSocket(userData) {
    currentUserData = userData;
    const currentUsername = userData.Username;
    
    // Close any existing connection
    if (socket) {
        socket.close();
    }
    
    // Create new connection
    socket = new WebSocket(`ws://${window.location.host}/ws`);

    socket.onopen = () => {
        console.log(`WebSocket connected for ${currentUsername}`);
    };

    socket.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
            console.log("Received message via WebSocket:", msg);
            
            // If this is a new message (not history loading), display it
            if (msg.senderID === currentUsername || msg.receiverID === currentUsername) {
                // Import the display function to handle the message
                import("./chat.js").then(module => {
                    module.displayChatMessage(msg, currentUsername);
                });
            }
        } catch (error) {
            console.error("Error processing WebSocket message:", error);
        }
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed");
        // Attempt to reconnect after a delay
        setTimeout(() => {
            if (currentUserData) {
                initWebSocket(currentUserData);
            }
        }, 3000);
    };
    
    socket.onerror = (error) => {
        console.log("WebSocket error:", error);
    };
}

function getSocket() {
    return socket; 
}

export { initWebSocket, getSocket };