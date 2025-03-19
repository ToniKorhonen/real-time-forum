import { loadMainContent } from "./mainContent.js";
import { loadCommentForm } from "./comments.js";

function loadCreatePostForm(pushstate = true) {
    if (pushstate) history.pushState({}, "", "/createpost");

    const app = document.getElementById("app");
    app.innerHTML = `
        <h1>Create a New Post</h1>
        <form id="create-post-form">
            <div>
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" required maxlength="100" placeholder="Enter your title" />
            </div>
            <div>
                <label for="content">Post:</label>
                <textarea id="content" name="content" required rows="5" cols="50" placeholder="Write your post here..."></textarea>
            </div>
            <div>
                <label for="category">Category:</label>
                <select id="category" name="category" required>
                    <option value="general">General</option>
                    <option value="news">News</option>
                    <option value="discussion">Discussion</option>
                    <option value="technology">Technology</option>
                    <option value="sports">Sports</option>
                    <option value="entertainment">Entertainment</option>
                </select>
            </div>
            <div>
                <button type="submit" id="submit-btn">Submit Post</button>
            </div>
            <p id="post-error" style="color: red;"></p>
        </form>`;

    document.getElementById("create-post-form").addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = {
            title: document.getElementById("title").value,
            content: document.getElementById("content").value,
            category: document.getElementById("category").value
        };

        console.log("Submitting post:", formData);

        const response = await fetch("/createpost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include"
        });

        if (response.ok) {
            console.log("Post created successfully!");
            alert("Post created successfully!");
            history.pushState({}, "", "/");
            loadMainContent();
        } else {
            document.getElementById("post-error").textContent = "Failed to create post. Please try again.";
            console.error("Failed to create post:", await response.text());
        }
    });
}

function loadPosts() {
    fetch("/posts")
        .then(response => response.json())
        .then(posts => {
            const feedContainer = document.getElementById("feed");
            feedContainer.innerHTML = "";
            posts.forEach(post => {
                const postEl = createPostElement(post);
                feedContainer.appendChild(postEl);
            });
        })
        .catch(err => console.error("Error loading posts:", err));
}

function createPostElement(post) {
    const postElement = document.createElement("div");
    postElement.classList.add("post");

    const title = document.createElement("h2");
    title.textContent = post.title;

    const content = document.createElement("p");
    content.textContent = post.content;

    const category = document.createElement("p");
    category.textContent = `Category: ${post.category}`;

    const commentButton = document.createElement("button");
    commentButton.textContent = "Comment";
    commentButton.classList.add("comment-button");
    commentButton.addEventListener("click", (e) => {
        e.preventDefault();
        loadCommentForm(post.id, true);
      });

    postElement.appendChild(title);
    postElement.appendChild(content);
    postElement.appendChild(category);
    postElement.appendChild(commentButton);

    return postElement;
}

export { loadPosts, loadCreatePostForm, createPostElement};
