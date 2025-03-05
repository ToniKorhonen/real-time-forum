package middleware

import (
	"crypto/rand"
	"fmt"
	"net/http"
	data "real-time-forum/src/api/Data"
	"time"
)

// GenerateUUID creates a random UUID (version 4) and returns it as a string.
func GenerateUUID() string {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		return ""
	}
	// Set version (4) and variant bits.
	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80

	return fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
}

// Cookie creates a session for the user, then sets the session_id cookie.
func Cookie(w http.ResponseWriter, user *data.User) {
	sessionID := GenerateUUID() // sessionID is a string

	// Build the Session struct using string IDs.
	session := data.Session{
		SessionID:  sessionID,
		UserUUID:   user.ID, // user.ID is now a string
		Expires_at: time.Now().Add(1 * time.Hour),
	}

	err := data.InsertSession(&session)
	if err != nil {
		fmt.Println("Failed to store session:", err)
		http.Error(w, "Could not create session", http.StatusInternalServerError)
		return
	}

	// Set the session cookie.
	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    sessionID,
		Expires:  session.Expires_at,
		HttpOnly: true,
		Secure:   false, // set to true in production
		Path:     "/",
	})

	fmt.Println("Session created successfully:", sessionID)
}
