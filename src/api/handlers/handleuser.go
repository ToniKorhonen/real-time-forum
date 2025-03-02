package handlers

import (
	"encoding/json"
	"net/http"
	data "real-time-forum/src/api/Data"
)

func handleUserData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	cookie, err := r.Cookie("session_id")
	if err != nil || cookie.Value == "" {
		http.Error(w, "error getting cookie", http.StatusUnauthorized)
		return
	}

	isValid, err := data.IsSessionValid(cookie.Value)
	if err != nil || !isValid {
		http.Error(w, "invalid cookie", http.StatusUnauthorized)
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

	json.NewEncoder(w).Encode(user)
}
