package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	data "real-time-forum/src/api/Data"
)

func handleComment(w http.ResponseWriter, r *http.Request) {
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

	var newComment data.Comment
	if err := json.NewDecoder(r.Body).Decode(&newComment); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	if newComment.Content == "" {
		http.Error(w, "Missing field", http.StatusBadRequest)
		return
	}
	query := `INSERT INTO comments (post_id, content, user_id, created_at) VALUES (?, ?, ?, ?)`
	_, err = data.DB.Exec(query, newComment.PostID, newComment.Content, userIDStr, time.Now())
	if err != nil {
		http.Error(w, "Failed to create comment", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Comment created successfully")
}

// getComments with a JOIN to retrieve username
func getComments(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	postID := r.URL.Query().Get("post_id")
	var rows *sql.Rows
	var err error

	// JOIN with users table
	if postID != "" {
		query := `
            SELECT c.id, c.post_id, c.user_id, u.username, c.content, c.created_at
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.uuid
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
        `
		rows, err = data.DB.Query(query, postID)
	} else {
		query := `
            SELECT c.id, c.post_id, c.user_id, u.username, c.content, c.created_at
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.uuid
            ORDER BY c.created_at DESC
        `
		rows, err = data.DB.Query(query)
	}
	if err != nil {
		log.Println("Database query error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var comments []data.Comment
	for rows.Next() {
		var comment data.Comment
		if err := rows.Scan(
			&comment.ID,
			&comment.PostID,
			&comment.UserID,
			&comment.Username,
			&comment.Content,
			&comment.CreatedAt,
		); err != nil {
			log.Println("Error scanning comment:", err)
			http.Error(w, "Error scanning comment", http.StatusInternalServerError)
			return
		}
		comments = append(comments, comment)
	}
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(comments); err != nil {
		log.Println("Error encoding comments:", err)
		http.Error(w, "Error encoding comments", http.StatusInternalServerError)
		return
	}
}
