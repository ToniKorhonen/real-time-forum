// comments.js

import { loadMainContent } from "./mainContent.js";

function loadCommentForm(postId, pushstate = true) {
  if (pushstate && window.location.pathname !== "/createcomment") {
    history.pushState({}, "", `/createcomment`);
  }

  const app = document.getElementById("app");
  app.innerHTML = `
    <h1>Leave a Comment</h1>
    <form id="comment-form">
      <input type="hidden" id="post-id" value="${postId}" />
      <div>
        <label for="content">Comment:</label>
        <textarea id="content" name="content" required rows="5" cols="50" placeholder="Write your comment here..."></textarea>
      </div>
      <div>
        <button type="submit">Submit Comment</button>
      </div>
      <p id="comment-error" style="color: red;"></p>
    </form>`;

  document.getElementById("comment-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      post_id: Number(document.getElementById("post-id").value),
      content: document.getElementById("content").value.trim()
    };

    if (!Number.isInteger(formData.post_id)) {
      alert("Invalid post_id.");
      return;
    }

    const response = await fetch("/createcomment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include"
    });
    console.log(formData.content);
    if (response.ok) {
      console.log("Comment created successfully!");
      alert("Comment created successfully!");
      history.pushState({}, "", "/");
      loadMainContent();
    } else {
      const errorText = await response.text();
      document.getElementById("comment-error").textContent = "Failed to create comment. " + errorText;
      console.error("Failed to create comment:", errorText);
    }
  });
}

function loadComments() {
  fetch("/comments")
    .then((res) => res.json())
    .then((comments) => {
      const feedContainer = document.getElementById("comment-feed");
      feedContainer.innerHTML = "";
      comments.forEach((comment) => {
        const commentEl = createCommentElement(comment);
        feedContainer.appendChild(commentEl);
      });
    })
    .catch((err) => console.error("Error loading comments:", err));
}

function createCommentElement(comment) {
  // Log for debugging
  console.log("Comment data:", comment);
  const commentElement = document.createElement("div");
  commentElement.classList.add("comment");
  // Use comment.username; if missing, default to "Anonymous"
  const userName = comment.username || "Anonymous";
  commentElement.innerHTML = `<p><strong>${userName}:</strong> ${comment.content}</p>`;
  return commentElement;
}

function openCommentsModal(postId, anchorElement) {
  // Toggle: if the modal is already open, remove it.
  const existingModal = document.getElementById("comments-modal");
  if (existingModal) {
    existingModal.remove();
    return;
  }
  
  // Get the bounding rectangle of the clicked post element.
  const rect = anchorElement.getBoundingClientRect();
  
  // Create overlay container with absolute positioning
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "comments-modal";
  modalOverlay.style.position = "absolute";
  // Position it just below the clicked post:
  modalOverlay.style.top = rect.bottom + window.scrollY + "px";
  modalOverlay.style.left = rect.left + window.scrollX + "px";
  modalOverlay.style.backgroundColor = "rgba(22, 19, 2, 0.9)";
  modalOverlay.style.zIndex = "1000";
  
  // Create modal content container without a close button
  const modalContent = document.createElement("div");
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "8px";
  modalContent.style.maxHeight = "300px"; // adjust as needed
  modalContent.style.overflowY = "auto";
  modalContent.style.color = "rgb(241, 228, 104)";
  modalContent.innerHTML = `
    <h2>Comments</h2>
    <div id="modal-comment-feed"></div>
  `;
  
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
  
  // Fetch comments for this post
  fetch(`/comments?post_id=${postId}`)
    .then((res) => res.json())
    .then((comments) => {
      if (comments == null) comments = [];
      const feedContainer = modalContent.querySelector("#modal-comment-feed");
      feedContainer.innerHTML = "";
      comments.forEach((comment) => {
        const commentEl = createCommentElement(comment);
        feedContainer.appendChild(commentEl);
      });
    })
    .catch((err) => console.error("Error loading comments:", err));
}

export { loadComments, loadCommentForm, openCommentsModal };
