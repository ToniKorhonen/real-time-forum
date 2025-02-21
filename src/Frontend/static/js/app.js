document.addEventListener('DOMContentLoaded', function () {
    loadHomePage();

    document.getElementById('login-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadLoginForm();
    });

    document.getElementById('register-link').addEventListener('click', (e) => {
        e.preventDefault();
        loadRegisterForm();
    });
});

function loadHomePage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <h1>Welcome to the Home Page</h1>
      <p>This is a simple homepage</p>
      <p>Click <a href="#" id="login-link">here</a> to login</p>
      <p>Click <a href="#" id="register-link">here</a> to register</p>
    `;
}

function loadLoginForm() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <form id="login-form" method="POST" action="/login">
        <div>
            <label for="username_or_email">Username or Email:</label>
            <input type="text" id="username_or_email" name="username_or_email" required />
        </div>
        <div>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
    </form>
    `;
}

function loadRegisterForm() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <form id="register-form" method="POST" action="/register">
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
            <label for="Age">Age:</label>
            <input type="number" id="age" name="age" required />
        </div>
        <div>
            <label for="Gender">Gender:</label>
            <input type="text" id="gender" name="gender" required />
        </div>
        <button type="submit">Register</button>
    </form>
    `;
}