function loadHeader() {
    const header = document.getElementById("header");
    header.innerHTML = `
      <nav id="nav-bar">
        <a href="#" id="home-link">Home</a>
        <a href="#" id="login-link">Login</a>
        <a href="#" id="register-link">Register</a>
        <a href="#" id="createpost-link">Create Post</a>
        <a href="#" id="logout-link">Logout</a>
      </nav>
    `;
  }
  
  export { loadHeader };
  