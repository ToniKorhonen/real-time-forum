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

}