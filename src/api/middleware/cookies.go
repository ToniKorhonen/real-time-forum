package middleware

import (
	"encoding/base64"
	"fmt"
	"net/http"
	data "real-time-forum/src/api/Data"
	"time"
)

func Cookie(w http.ResponseWriter, user *data.User) {
	sessionID := GenerateUUID()

	session := data.Session{
		SessionID:  sessionID,
		UserUUID:   user.ID,
		Expires_at: time.Now().Add(1 * time.Hour),
	}

	err := data.InsertSession(&session)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(base64.StdEncoding.EncodeToString(sessionID))

	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    base64.StdEncoding.EncodeToString(sessionID),
		Path:     "/",
		HttpOnly: true,
		Expires:  session.Expires_at,
		MaxAge:   3600,
	})
}
