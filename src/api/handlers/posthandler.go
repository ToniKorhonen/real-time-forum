package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	data "real-time-forum/src/api/Data"
	"time"
)

// handlePost processes post creation.
func handlePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	cookies := r.Cookies()
	fmt.Println("Received Cookies:")
	for _, c := range cookies {
		fmt.Printf("%s = %s\n", c.Name, c.Value)
	}

	cookie, err := r.Cookie("session_id")
	if err != nil || cookie.Value == "" {
		http.Error(w, "Error getting session cookie", http.StatusUnauthorized)
		return
	}

	// Validate session.
	isValid, err := data.IsSessionValid(cookie.Value)
	if err != nil || !isValid {
		http.Error(w, "Invalid session", http.StatusUnauthorized)
		return
	}

	// Retrieve user ID (string) from the session.
	userID, err := data.GetCurrentUserID(r)
	if err != nil {
		http.Error(w, "Unknown user", http.StatusUnauthorized)
		return
	}

	// Fetch user details using the string userID.
	user, err := data.GetUserByUUID(userID)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	userIDStr := user.ID

	var newPost data.Post
	err = json.NewDecoder(r.Body).Decode(&newPost)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if newPost.Title == "" || newPost.Content == "" || newPost.Category == "" {
		http.Error(w, "Missing fields", http.StatusBadRequest)
		return
	}

	// Insert the new post into the DB. Adjust columns to match your table.
	query := `INSERT INTO posts (title, content, category, user_id, created_at) VALUES (?, ?, ?, ?, ?)`
	_, err = data.DB.Exec(query, newPost.Title, newPost.Content, newPost.Category, userIDStr, time.Now())
	if err != nil {
		http.Error(w, "Failed to create post", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintln(w, "Post created successfully")
}

func getPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Ensure you are using the correct reference to your DB, e.g., data.DB if that's correct.
	rows, err := data.DB.Query(`
        SELECT id, title, content, category, user_id, created_at, likes_count, dislikes_count, comments_count 
        FROM posts 
        ORDER BY created_at DESC`)
	if err != nil {
		log.Println("Database query error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []data.Post
	for rows.Next() {
		var post data.Post
		if err := rows.Scan(&post.ID, &post.Title, &post.Content, &post.Category, &post.UserID, &post.CreatedAt, &post.LikesCount, &post.DislikesCount, &post.CommentsCount); err != nil {
			log.Println("Error scanning post:", err)
			http.Error(w, "Error scanning post", http.StatusInternalServerError)
			return
		}
		posts = append(posts, post)
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		log.Println("Error encoding posts:", err)
		http.Error(w, "Error encoding posts", http.StatusInternalServerError)
		return
	}
}
