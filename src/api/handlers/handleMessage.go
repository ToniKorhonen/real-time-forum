package handlers

import (
	"encoding/json"
	"net/http"
	data "real-time-forum/src/api/Data"
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

	// Get messages between the two users
	messages, err := data.GetConversation(currentUser.Username, otherUsername)
	if err != nil {
		http.Error(w, "Error fetching messages", http.StatusInternalServerError)
		return
	}

	// Return the messages as JSON
	json.NewEncoder(w).Encode(messages)
}
