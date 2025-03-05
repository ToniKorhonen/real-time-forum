import { loadHomePage } from "./home.js";
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
    } else if (window.location.pathname === "/createpost" && userData) {
        loadCreatePostForm();
    } else {
        loadHomePage(userData);
    }
}

// Ensure routing updates dynamically when users navigate
window.addEventListener("popstate", () => {
    handleRouting();
});

export { handleRouting };
