package handlers

import (
	"fmt"
	"net/http"
	data "real-time-forum/src/api/Data"
	"time"
)

func handleLogout(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Cookie("session_id"))

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

	data.SetUserOffline(user.Username)

	// Clear the session cookie
	cookie := &http.Cookie{
		Name:     "session_id",
		Value:    "",
		Path:     "/",
		Expires:  time.Now().Add(-1 * time.Hour), // Expire the cookie
		MaxAge:   -1,                             // Set MaxAge to -1 to delete the cookie
		HttpOnly: true,
	}
	http.SetCookie(w, cookie)

	// Redirect the user to the login page after logging out
}
