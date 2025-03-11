import { loadMainContent } from "./mainContent.js";
import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";
import { loadCreatePostForm } from "./posts.js"; // Import the function to load the post creation form

function handleRouting(userData) {
    if (window.location.pathname === "/logout") {
        console.log("User logged out");
        document.body.innerHTML = `<p>Logging out...</p>`;
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    } else if (window.location.pathname === "/register") {
        loadRegisterForm();
    } else if (window.location.pathname === "/login") {
        loadLoginForm();
    } 
    if (window.location.pathname === "/") {
    }
}

export { handleRouting }; // Export the handleRouting function