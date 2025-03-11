import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";

function loadMainContent(userData, pushState = true) {
  const content = document.getElementById("content");
  if (pushState) {
    history.pushState({}, "", "/");
    content.innerHTML = ""; // Clear previous content
  }

  const mainTitle = document.createElement("h1");
  mainTitle.textContent = "Welcome to the Home Page";
  content.appendChild(mainTitle);

  const paragraph = document.createElement("p");
  paragraph.innerHTML = `
  This is a simple homepage<br>
  Click <a href="#" id="home-login-link">here</a> to login<br>
  Click <a href="#" id="home-register-link">here</a> to register
`;

  content.appendChild(paragraph);

  console.log("test")


  if (userData) {
    updateUserInfo(userData);
  } else {
    console.log(userData)
    console.log("wtf is this shrodinger's user")
  }



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

function updateUserInfo(userData) {
  const content = document.getElementById("content");
  const userInfo = document.createElement("div");
  const username = userData.Username
  console.log(userData)
  console.log(username)
  console.log(typeof username)
  console.log(typeof userData)
  console.log("user exists")
  userInfo.innerHTML = `
    <h2>User Info</h2>
    <p>Username: ${username} </p>
  `;
  content.appendChild(userInfo);
}

// Add a console log to track when loadMainContent is called
console.log("loadMainContent called");

export { loadMainContent }; // Export the loadBody function