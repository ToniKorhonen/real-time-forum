package data

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"time"
)

// InsertSession inserts or updates a session record in the DB.
func InsertSession(session *Session) error {
	existingSession := &Session{}
	err := DB.QueryRow(`
        SELECT session_id FROM sessions WHERE user_UUID = ?`,
		session.UserUUID,
	).Scan(&existingSession.SessionID)

	if err != nil && err != sql.ErrNoRows {
		return err
	}

	// If no existing session for this user, INSERT
	if err == sql.ErrNoRows {
		_, err = DB.Exec(`
            INSERT INTO sessions (session_id, user_UUID, expires_at)
            VALUES (?, ?, ?);`,
			session.SessionID,
			session.UserUUID,
			session.Expires_at.Format("2006-01-02 15:04:05"),
		)
	} else {
		// Otherwise, UPDATE
		_, err = DB.Exec(`
            UPDATE sessions
            SET session_id = ?, expires_at = ?
            WHERE user_UUID = ?;`,
			session.SessionID,
			session.Expires_at.Format("2006-01-02 15:04:05"),
			session.UserUUID,
		)
	}

	if err != nil {
		fmt.Println("Failed to store session:", err)
	} else {
		fmt.Println("Session stored successfully:", session.SessionID)
	}

	return err
}

// StoreSession is a helper if you want to create/insert a session in one call.
func StoreSession(sessionID string, userID string, expiration time.Time) error {
	session := &Session{
		SessionID:  sessionID,
		UserUUID:   userID,
		Expires_at: expiration,
	}

	fmt.Println("Storing session:", session)

	err := InsertSession(session)
	if err != nil {
		fmt.Println("Failed to store session:", err)
		return err
	}

	fmt.Println("Session stored successfully:", sessionID)
	return nil
}

// IsSessionValid checks if a session ID is present and not expired.
func IsSessionValid(sessionID string) (bool, error) {
	var count int
	query := `SELECT COUNT(*) FROM sessions WHERE session_id = ? AND expires_at > ?`
	err := DB.QueryRow(query, sessionID, time.Now()).Scan(&count)

	fmt.Println("Checking session:", sessionID)

	if err != nil {
		fmt.Println("Session validation error:", err)
		return false, err
	}

	if count == 0 {
		fmt.Println("Invalid session (not found in DB):", sessionID)
		return false, nil
	}

	fmt.Println("Session is valid:", sessionID)
	return true, nil
}

// GetCurrentUserID returns the user UUID (as string) from the session cookie.
func GetCurrentUserID(r *http.Request) (string, error) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		fmt.Println("Session cookie not found")
		return "", errors.New("session not found")
	}

	fmt.Println("Session cookie received:", cookie.Value)

	var userUUID string
	query := `SELECT user_UUID FROM sessions WHERE session_id = ?`
	err = DB.QueryRow(query, cookie.Value).Scan(&userUUID)
	if err != nil {
		fmt.Println("User not found for session:", cookie.Value)
		return "", errors.New("user not found")
	}

	fmt.Println("User found for session:", userUUID)
	return userUUID, nil
}
