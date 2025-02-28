import { renderLayout } from "./layout.js";
import { loadHomePage } from "./home.js";

document.addEventListener("DOMContentLoaded", function () {
    // Render layout
    renderLayout();

    // Initialize home page
    loadHomePage();
});