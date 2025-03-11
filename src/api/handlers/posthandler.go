package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	data "real-time-forum/src/api/Data"
	"time"
)

type Post struct {
	Title    string `json:"title"`
	Content  string `json:"content"`
	Category string `json:"category"`
}

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

	var newPost Post
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
