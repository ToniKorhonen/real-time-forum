import { loadHomePage } from "./home.js";
import { loadNavigation } from "./navigation.js";
import { handleRouting } from "./routing.js";

function renderLayout(userData ) {
    document.body.innerHTML = `
        <nav>
            <a href="#" id="home-link">Home</a>
            <a href="#" id="login-link">Login</a>
            <a href="#" id="register-link">Register</a>
            <a href="#" id="logout-link">Logout</a>
        </nav>
        <div id="app"></div>
        <footer>
            <p>Footer</p>
        </footer>
    `;
        
    loadHomePage(userData);

    loadNavigation();
    
    handleRouting();
}

export { renderLayout }; // Export the renderLayout function