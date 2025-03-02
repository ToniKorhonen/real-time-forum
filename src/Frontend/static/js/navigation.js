import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";
import { loadHomePage } from "./home.js";

async function loadNavigation() {
    document.getElementById("logout-link").addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            let response = await fetch("/logout", { method: "POST" });
            if (!response.ok) throw new Error("Logout failed");
            loadHomePage();
            history.pushState({}, "", "/");
        } catch (error) {
            console.log(error.message);
        }
    }

    );

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