import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";
import { loadCreatePostForm, loadPosts } from "./posts.js";
import { usersOnline } from "./chat.js";

function loadMainContent(userData, pushState = true) {
  const content = document.getElementById("content");
  if (pushState) {
    history.pushState({}, "", "/");
    content.innerHTML = ""; // Clear previous content
  }

  const header = document.createElement("div");
  header.id = "header";
  
  const logo = document.createElement("img");
  logo.src = "./static/css/yelloutLogo.png";
  logo.alt = "Yellout Logo";
  logo.id = "header-logo";

  const mainTitle = document.createElement("h1");
  mainTitle.textContent = "Welcome to Yellout";

  header.appendChild(logo);
  header.appendChild(mainTitle);
  content.appendChild(header);

  const paragraph = document.createElement("p");
  paragraph.innerHTML = `
    Click <a href="#" id="home-login-link">here</a> to login<br>
    Click <a href="#" id="home-register-link">here</a> to register<br>
    Click <a href="#" id="home-create-post-link">here</a> to create a post
  `;
  content.appendChild(paragraph);

  const feed = document.createElement("div");
  feed.id = "feed";
  content.appendChild(feed);

  if (userData) {
    usersOnline(userData);
  }

  document.getElementById("home-login-link").addEventListener("click", (e) => {
    e.preventDefault();
    loadLoginForm();
  });

  document.getElementById("home-register-link").addEventListener("click", (e) => {
    e.preventDefault();
    loadRegisterForm();
  });

  document.getElementById("home-create-post-link").addEventListener("click", (e) => {
    e.preventDefault();
    loadCreatePostForm();
  });

  loadPosts();
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