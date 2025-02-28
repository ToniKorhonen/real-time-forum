import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";
import { loadHomePage } from "./home.js";

function loadNavigation() {
    document.getElementById("login-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadLoginForm();
        history.pushState({}, "", "/login");
    });

    document.getElementById("register-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadRegisterForm();
        history.pushState({}, "", "/register");
    });

    document.getElementById("home-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadHomePage();
        history.pushState({}, "", "/"); // Update URL
    });

    // Handle browser back/forward navigation
    window.addEventListener("popstate", () => {
        handleRouting();
    });
}

export { loadNavigation }; // Export the loadNavigation function