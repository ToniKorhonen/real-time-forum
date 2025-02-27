function loadLoginForm(pushState = true) {
    if (pushState) history.pushState({}, "", "/login");

    const app = document.getElementById("app");
    app.innerHTML = `
      <form id="login-form">
        <div>
            <label for="username_or_email">Username or Email:</label>
            <input type="text" id="username_or_email" name="username_or_email" required />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
        <p id="login-error" style="color: red;"></p>
      </form>
    `;

    document.getElementById("login-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });

        if (response.ok) {
            alert("Login successful!");
            loadHomePage();
        } else {
            document.getElementById("login-error").textContent = "Invalid username/email or password";
        }
    });
}

export { loadLoginForm };