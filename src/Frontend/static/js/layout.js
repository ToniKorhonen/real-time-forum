import { loadMainContent } from "./mainContent.js";
import { loadNavigation } from "./navigation.js";
import { handleRouting } from "./routing.js";
import { initWebSocket } from "./websocket.js";
import { loadHeader } from "./header.js";

function renderLayout(userData) {
    document.body.innerHTML = `
    <div id="app">
        <header id="header"></header>
        <div id="top-right-icons">
            <a href="#" id="logout-link" title="Logout">
                <img src="/static/assets/sign-out-option.png" />
            </a>
        </div>
        <main id="content"></main>
        <footer id="footer"></footer>
    </div>
    `;


    loadHeader(userData);

    loadMainContent(userData);

    loadNavigation(userData);

    handleRouting(userData);

    if (userData) {
        initWebSocket(userData);
    }
}

export { renderLayout }; // Export the renderLayout function