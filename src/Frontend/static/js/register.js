import { loadMainContent } from "./mainContent.js";

function loadRegisterForm(pushState = true) {
    if (pushState) history.pushState({}, "", "/register");

    const content = document.getElementById("content");
    content.innerHTML = `
      <form action="/register" method="post" id="register-form">
        <div>
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required />
        </div>
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
        </div>
        <div>
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" required />
        </div>
        <div>
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" required />
        </div>
        <div>
            <label for="age">Age:</label>
            <input type="number" id="age" name="age" required />
        </div>
        <div>
            <label for="gender">Gender:</label>
            <select id="gender" name="gender" required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        </div>
        <button type="submit">Register</button>
        <p id="register-error" style="color: white;"></p>
      </form>
    `;

    document.getElementById("register-form").addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const formData = new URLSearchParams(new FormData(e.target)); // Convert to URL-encoded format
    
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });
    
        if (response.ok) {
            console.log("Registration successful!");
            loadMainContent();
        } else {
            try {
                const data = await response.json();
                document.getElementById("register-error").textContent = data.message;
            } catch (error) {
                console.log("An error occurred:", error.message);
            }
        }
    });
    
}

export { loadRegisterForm };