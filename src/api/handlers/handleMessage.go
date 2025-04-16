package handlers

import (
	"encoding/json"
	"net/http"
	data "real-time-forum/src/api/Data"
	"strconv"
)

func handleGetMessages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get current user from session
	userID, err := data.GetCurrentUserID(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	currentUser, err := data.GetUserByUUID(userID)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Get the other user from query parameter
	otherUsername := r.URL.Query().Get("user")
	if otherUsername == "" {
		http.Error(w, "Missing user parameter", http.StatusBadRequest)
		return
	}

	// Get pagination parameters
	limit := 10
	if l := r.URL.Query().Get("limit"); l != "" {
		if n, err := strconv.Atoi(l); err == nil && n > 0 {
			limit = n
		}
	}

	offset := 0
	if o := r.URL.Query().Get("offset"); o != "" {
		if n, err := strconv.Atoi(o); err == nil && n >= 0 {
			offset = n
		}
	}

	// Get messages between the two users with pagination
	messages, total, err := data.GetConversation(currentUser.Username, otherUsername, limit, offset)
	if err != nil {
		http.Error(w, "Error fetching messages", http.StatusInternalServerError)
		return
	}

	// Return paginated response
	response := struct {
		Messages []data.Message `json:"messages"`
		Total    int            `json:"total"`
		Limit    int            `json:"limit"`
		Offset   int            `json:"offset"`
	}{
		Messages: messages,
		Total:    total,
		Limit:    limit,
		Offset:   offset,
	}

	json.NewEncoder(w).Encode(response)
}
