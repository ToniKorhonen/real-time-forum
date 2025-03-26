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

  const mainTitle = document.createElement("h2");
  mainTitle.textContent = "Welcome to Yellout";

  header.appendChild(logo);
  header.appendChild(mainTitle);
  content.appendChild(header);

  const feed = document.createElement("div");
  feed.id = "feed";
  content.appendChild(feed);

  if (userData) {
    usersOnline(userData);
  }

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