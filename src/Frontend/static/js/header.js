
function loadHeader() {
    const header = document.getElementById("header");
    header.innerHTML = `
    <nav id="nav-bar">
      <a href="#" id="home-link" title="Home">
        <img src="/static/assets/home.png" alt="Home" />
        <span>Home</span>
      </a>
      <a href="#" id="login-link" title="Login">
        <img src="/static/assets/wireless-symbol.png" alt="Login" />
        <span>Login</span>
      </a>
      <a href="#" id="register-link" title="Register">
        <img src="/static/assets/register.png" alt="Register" />
        <span>Register</span>
      </a>
      <a href="#" id="createpost-link" title="Create Post">
        <img src="/static/assets/write.png" alt="Create Post" />
        <span>Create Post</span>
      </a>
    </nav>
    `;
  }
  
  export { loadHeader };
  