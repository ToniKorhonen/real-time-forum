import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";
import { loadCreatePostForm } from "./posts.js"; // Keep this for creating posts

function loadHomePage(pushState = true) {
    if (pushState) history.pushState({}, "", "/");

    const app = document.getElementById("app");
    app.innerHTML = `
      <h1>Welcome to the Home Page</h1>
      <p>This is a simple homepage</p>
      <p>Click <a href="#" id="home-login-link">here</a> to login</p>
      <p>Click <a href="#" id="home-register-link">here</a> to register</p>
      <p>Click <a href="#" id="home-create-post-link">here</a> to create a post</p>
    `;

    // Attach event listeners
    document.getElementById("home-login-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadLoginForm();
    });

    document.getElementById("home-register-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadRegisterForm();
    });

    document.getElementById("home-create-post-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadCreatePostForm();
    });
}

export { loadHomePage };
