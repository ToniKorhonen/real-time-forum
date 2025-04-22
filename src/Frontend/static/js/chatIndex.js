import { usersOnline } from "./chatUI.js";
import { displayChatMessage } from "./chatUI.js";
import { setupTypingHandler, setupMessageHandler } from "./chatWebSocket.js";
import { getSocket } from "./websocket.js";

// Called once user is logged in
export function initializeChat(userData) {
    usersOnline(userData);

    const socket = getSocket();
    if (socket) {
        setupTypingHandler(socket);
        setupMessageHandler(socket);
    }
}
export { displayChatMessage };
