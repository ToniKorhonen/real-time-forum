import { loadMainContent } from "./mainContent.js";
import { loadLoginForm } from "./login.js";
import { loadRegisterForm } from "./register.js";
import { loadCreatePostForm } from "./posts.js";
import { loadCommentForm } from "./comments.js";

function handleRouting(userData) {
	const path = window.location.pathname;

	if (path === "/logout") {
		document.body.innerHTML = `<p>Logging out...</p>`;
		setTimeout(() => { window.location.href = "/"; }, 1000);
	} else if (path === "/register") {
		loadRegisterForm();
	} else if (path === "/login") {
		loadLoginForm();
	} else if (path === "/createpost") {
		loadCreatePostForm(false);
	} else if (path === "/createcomment") {
		loadCommentForm(false);
	} else {
		loadMainContent();
	}
}

export { handleRouting };
