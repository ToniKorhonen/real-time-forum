import { loadMainContent } from "./mainContent.js";

function loadLoginForm(userData, pushState = true) {
    if (pushState) history.pushState({}, "", "/login");

    const content = document.getElementById("content");
    content.innerHTML = `
      <form action="/login" method="POST" id="login-form">
        <div>
            <label for="username_or_email">Username or Email:</label>
            <input type="text" id="username_or_email" name="username_or_email" required />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
        <p id="login-error" style="color: white;"></p>
      </form>
    `;

    document.getElementById("login-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new URLSearchParams(new FormData(e.target)); // Convert to URL-encoded format
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });

        if (response.ok) {
            console.log("Login successful!");
            loadMainContent(userData);
        } else {
            document.getElementById("login-error").textContent = "Invalid username/email or password";
        }
    });
}

export { loadLoginForm };