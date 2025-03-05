import { loadHomePage } from "./home.js";
import { loadNavigation } from "./navigation.js";
import { handleRouting } from "./routing.js";

function renderLayout(userData) {
    document.body.innerHTML = `
        <nav>
            <a href="#" id="home-link">Home</a>
            <a href="#" id="login-link">Login</a>
            <a href="#" id="register-link">Register</a>
            <a href="#" id="create-post-link">Create Post</a>
            <a href="#" id="logout-link">Logout</a>
        </nav>
        <div id="app"></div>
        <footer>
            <p>Footer</p>
        </footer>
    `;
    
    // Load home page
    loadHomePage(userData);

    // Initialize navigation
    loadNavigation();
    handleRouting(userData);

    // Attach event listeners for navigation
    document.getElementById("home-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadHomePage(userData);
    });

    // If user is logged in, add event listener for "Create Post"
    if (userData) {
        document.getElementById("createpost-link").addEventListener("click", (e) => {
            e.preventDefault();
            history.pushState({}, "", "/createpost");
            handleRouting(userData);
        });
    }
}

export { renderLayout };
