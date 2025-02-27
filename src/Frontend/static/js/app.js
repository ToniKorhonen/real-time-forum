document.addEventListener("DOMContentLoaded", function () {
    // Initialize home page
    loadHomePage();

    // Attach event listeners for persistent navbar links
    document.getElementById("home-link").addEventListener("click", (e) => {
        e.preventDefault();
        loadHomePage();
    });

    // document.getElementById("login-link").addEventListener("click", (e) => {
    //     e.preventDefault();
    //     loadLoginForm();
    // });

    // document.getElementById("register-link").addEventListener("click", (e) => {
    //     e.preventDefault();
    //     loadRegisterForm();
    // });

    // Handle browser back/forward navigation
    window.addEventListener("popstate", () => {
        if (window.location.pathname === "/register") {
            loadRegisterForm(false); // Do not push state again
        } else if (window.location.pathname === "/login") {
            loadLoginForm(false);
        } else {
            loadHomePage(false);
        }
    });
});

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

function loadRegisterForm(pushState = true) {
    if (pushState) history.pushState({}, "", "/register");

    const app = document.getElementById("app");
    app.innerHTML = `
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
        <p id="register-error" style="color: red;"></p>
      </form>
    `;

    // document.getElementById("register-form").addEventListener("submit", async (e) => {
    //     e.preventDefault();

    //     const formData = new FormData(e.target);
    //     const response = await fetch("/register", {
    //         method: "POST",
    //         body: formData
    //     });

    //     if (response.ok) {
    //         alert("Registration successful! Redirecting to login...");
    //         loadLoginForm();
    //     } else {
    //         document.getElementById("register-error").textContent = "Registration failed. Check inputs.";
    //     }
    // });
}
