import { loadMainContent } from "./mainContent.js";
import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";

function handleRouting() {
    if (window.location.pathname === "/logout") {
        // Handle logout
        console.log("Logout");
    }
    if (window.location.pathname === "/register") {
        loadRegisterForm();
    } else if (window.location.pathname === "/login") {
        loadLoginForm();
    } 
    if (window.location.pathname === "/") {
    }
}

export { handleRouting }; // Export the handleRouting function