import { renderLayout } from "./layout.js";
import { initializeNotifications } from "./chatNotifications.js";


document.addEventListener("DOMContentLoaded", async () => {
    let userData = null;

    try {
        let response = await fetch("/api/user");
        if (!response.ok) throw new Error("User not logged in");
        userData = await response.json();
    } catch (error) {
        console.log(error.message);
    }

    initializeNotifications();

    renderLayout(userData);
});
