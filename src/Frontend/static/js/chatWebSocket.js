import { getCurrentUsername } from "./chatState.js";
import { displayChatMessage } from "./chatIndex.js"; // Re-imported to avoid circular imports

export function setupTypingHandler(socket) {
    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        if (data.type !== "typing") return;
        const currentUser = getCurrentUsername();
        const otherUser = data.senderID === currentUser ? data.receiverID : data.senderID;
        const indicator = document.getElementById(`typing-indicator-${otherUser}`);
        if (indicator) indicator.style.display = data.stop ? "none" : "block";
    });
}

export function setupMessageHandler(socket) {
    socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "chat" || !data.type) {
            displayChatMessage(data, getCurrentUsername());
        }
    });
}
