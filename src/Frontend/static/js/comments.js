import { loadMainContent } from "./mainContent.js";

function loadCommentForm(postId, pushstate = true) {
    // Prevent unnecessary URL updates
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
		console.log(formData.content)
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
		.then(res => res.json())
		.then(comments => {
			const feedContainer = document.getElementById("comment-feed");
			feedContainer.innerHTML = "";
			comments.forEach(comment => {
				const commentEl = createCommentElement(comment);
				feedContainer.appendChild(commentEl);
			});
		})
		.catch(err => console.error("Error loading comments:", err));
}

function createCommentElement(comment) {
	const commentElement = document.createElement("div");
	commentElement.classList.add("comment");
	commentElement.innerHTML = `<p>${comment.content}</p>`;
	return commentElement;
}

export { loadComments, loadCommentForm };
