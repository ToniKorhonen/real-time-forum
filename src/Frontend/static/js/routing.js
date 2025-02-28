import { loadHomePage } from "./home.js";
import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";

function handleRouting() {
    if (window.location.pathname === "/register") {
        loadRegisterForm();
    } else if (window.location.pathname === "/login") {
        loadLoginForm();
    } else {
        loadHomePage();
    }
}

export { handleRouting }; // Export the handleRouting function