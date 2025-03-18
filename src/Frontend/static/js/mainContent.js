import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";
import { loadCreatePostForm } from "./posts.js";
import { loadPosts } from "./posts.js"; // Keep this for loading posts
import { usersOnline } from "./chat.js";

function loadMainContent(userData, pushState = true) {
  const content = document.getElementById("content");
  if (pushState) {
    history.pushState({}, "", "/");
    content.innerHTML = ""; // Clear previous content
  }

  // Create the header container
  const header = document.createElement("div");
  header.id = "header";
  
  // Create the image element (logo)
  const logo = document.createElement("img");
  logo.src = "./static/css/yelloutLogo.png";
  logo.alt = "Yellout Logo";
  logo.id = "header-logo";

  // Create the title
  const mainTitle = document.createElement("h1");
  mainTitle.textContent = "Welcome to Yellout";

  // Append logo and title to the header
  header.appendChild(logo);
  header.appendChild(mainTitle);

  // Now append the header to content
  content.appendChild(header);

  // Create the paragraph with links
  const paragraph = document.createElement("p");
  paragraph.innerHTML = `
    This is a simple homepage<br>
    Click <a href="#" id="home-login-link">here</a> to login<br>
    Click <a href="#" id="home-register-link">here</a> to register<br>
    Click <a href="#" id="home-create-post-link">here</a> to create a post
  `;
  content.appendChild(paragraph);

  // Create and append the feed
  const feed = document.createElement("div");
  feed.id = "feed";
  content.appendChild(feed);

  console.log("test");

  if (userData) {
    updateUserInfo(userData);
    usersOnline(userData);
  } else {
    console.log(userData);
    console.log("wtf is this schrodinger's user");

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