package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	data "real-time-forum/src/api/Data"
	"time"
)

func handleComment(w http.ResponseWriter, r *http.Request) {
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

	var newComment data.Comment
	err = json.NewDecoder(r.Body).Decode(&newComment)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	fmt.Println(newComment)
	if newComment.Content == "" {
		http.Error(w, "Missing field", http.StatusBadRequest)
		return
	}

	query := `INSERT INTO comments (post_id, content, user_id, created_at) VALUES (?, ?, ?, ?)`
	_, err = data.DB.Exec(query, newComment.PostID, newComment.Content, userIDStr, time.Now())
	if err != nil {
		http.Error(w, "Failed to create comment-back", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintln(w, "Comment created successfully")
}

func getComments(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rows, err := data.DB.Query(`
        SELECT id, post_id, user_id, content, created_at 
        FROM comments 
        ORDER BY created_at DESC`)
	if err != nil {
		log.Println("Database query error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var comments []data.Comment
	for rows.Next() {
		var comment data.Comment
		if err := rows.Scan(&comment.ID, &comment.PostID, &comment.UserID, &comment.Content, &comment.CreatedAt); err != nil {
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
