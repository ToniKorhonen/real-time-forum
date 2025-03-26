package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	data "real-time-forum/src/api/Data"
)

// handlePost remains the same for inserting posts.
func handlePost(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	cookie, err := r.Cookie("session_id")
	if err != nil || cookie.Value == "" {
		http.Error(w, "Error getting session cookie", http.StatusUnauthorized)
		return
	}
	isValid, err := data.IsSessionValid(cookie.Value)
	if err != nil || !isValid {
		http.Error(w, "Invalid session", http.StatusUnauthorized)
		return
	}
	userID, err := data.GetCurrentUserID(r)
	if err != nil {
		http.Error(w, "Unknown user", http.StatusUnauthorized)
		return
	}
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

	query := `INSERT INTO posts (title, content, category, user_id, created_at) VALUES (?, ?, ?, ?, ?)`
	_, err = data.DB.Exec(query, newPost.Title, newPost.Content, newPost.Category, userIDStr, time.Now())
	if err != nil {
		http.Error(w, "Failed to create post", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Post created successfully")
}

// getPosts with a JOIN to retrieve username
func getPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// JOIN with users table to get username
	query := `
        SELECT p.id, p.title, p.content, p.category, p.user_id, u.username, p.created_at,
               COUNT(c.id) AS comments_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.uuid
        LEFT JOIN comments c ON p.id = c.post_id
        GROUP BY p.id
        ORDER BY p.created_at DESC
    `
	rows, err := data.DB.Query(query)
	if err != nil {
		log.Println("Database query error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var posts []data.Post
	for rows.Next() {
		var post data.Post
		// We'll scan the joined username into post.Username
		if err := rows.Scan(
			&post.ID,
			&post.Title,
			&post.Content,
			&post.Category,
			&post.UserID,
			&post.Username,
			&post.CreatedAt,
			&post.CommentsCount,
		); err != nil {
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
