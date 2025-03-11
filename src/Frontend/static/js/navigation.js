import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";
import { loadMainContent } from "./mainContent.js";

async function loadNavigation(userData) {
    document.getElementById("logout-link").addEventListener("click", async (e) => {
        e.preventDefault();
        loadHomePage(userData);
        history.pushState({}, "", "/"); // Update URL
    });

        try {
            let response = await fetch("/logout", { method: "POST" });
            if (!response.ok) throw new Error("Logout failed");
            loadMainContent();
            history.pushState({}, "", "/");
        } catch (error) {
            console.log(error.message);
        }
    }

        document.getElementById("create-post-link").addEventListener("click", (e) => {
            e.preventDefault();
            loadCreatePostForm();
            history.pushState({}, "", "/createpost");
        });
    } else {
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
        loadMainContent(userData);
        history.pushState({}, "", "/"); // Update URL
    });

    // Handle browser back/forward navigation
    window.addEventListener("popstate", () => {
        handleRouting(userData);
    });

    console.log("✅ Navigation Loaded Successfully.");
}

export { loadNavigation }; 
