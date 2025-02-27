import { loadRegisterForm } from "./register.js";
import { loadLoginForm } from "./login.js";
import { loadHomePage } from "./home.js";

document.addEventListener("DOMContentLoaded", function () {
    // Initialize home page
    loadHomePage();

    // Attach event listeners for persistent navbar links
    document.getElementById("home-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadHomePage();
    });

    // Handle browser back/forward navigation
    window.addEventListener("popstate", () => {
        if (window.location.pathname === "/register") {
            loadRegisterForm(false); // Do not push state again
        } else if (window.location.pathname === "/login") {
            loadLoginForm(false);
        } else {
            loadHomePage(false);
        }
    });
});