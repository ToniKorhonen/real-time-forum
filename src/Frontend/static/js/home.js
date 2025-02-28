import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";

function loadHomePage(pushState = true) {
    if (pushState) history.pushState({}, "", "/");

    const app = document.getElementById("app");
    app.innerHTML = `
      <h1>Welcome to the Home Page</h1>
      <p>This is a simple homepage</p>
      <p>Click <a href="#" id="home-login-link">here</a> to login</p>
      <p>Click <a href="#" id="home-register-link">here</a> to register</p>
    `;



    // Attach event listeners to dynamically created links
    document.getElementById("home-login-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadLoginForm();
    });

    document.getElementById("home-register-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadRegisterForm();
    });
}


export { loadHomePage };