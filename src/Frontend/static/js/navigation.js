import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";
import { loadHomePage } from "./home.js";
import { loadCreatePostForm } from "./posts.js";
import { handleRouting } from "./routing.js"; // Ensure routing is handled correctly

async function loadNavigation(userData) {
    const nav = document.querySelector("nav");
    nav.innerHTML = `
        <a href="#" id="home-link">Home</a>
        ${userData ? '<a href="#" id="create-post-link">Create Post</a>' : ""}
        ${userData ? '<a href="#" id="logout-link">Logout</a>' : '<a href="#" id="login-link">Login</a>'}
        ${!userData ? '<a href="#" id="register-link">Register</a>' : ""}
    `;

    document.getElementById("home-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadHomePage(userData);
        history.pushState({}, "", "/"); // Update URL
    });

    if (userData) {
        document.getElementById("logout-link").addEventListener("click", async (e) => {
            e.preventDefault();
            try {
                let response = await fetch("/logout", { method: "POST" });
                if (!response.ok) throw new Error("Logout failed");

                console.log("✅ User logged out. Redirecting...");
                loadHomePage(null); // Clear user session
                history.pushState({}, "", "/");
            } catch (error) {
                console.log("Logout error:", error.message);
            }
        });

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
    }

    // Handle browser back/forward navigation
    window.addEventListener("popstate", () => {
        handleRouting(userData);
    });

    console.log("✅ Navigation Loaded Successfully.");
}

export { loadNavigation }; 
