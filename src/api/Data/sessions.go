package data

import (
	"database/sql"
	"encoding/base64"
	"fmt"
)

func IsSessionValid(sessionID string) (bool, error) {

	decodedSession, err := base64.StdEncoding.DecodeString(sessionID)
	if err != nil {
		fmt.Println(err)
		return false, err
	}
	var count int
	err = DB.QueryRow(`
        SELECT COUNT(*) FROM sessions
        WHERE session_id = ? AND expires_at > datetime('now')`,
		decodedSession,
	).Scan(&count)
	if err != nil {
		fmt.Println(err)
		return false, err
	}
	return count > 0, nil
}

func InsertSession(session *Session) error {
	existingSession := &Session{}
	err := DB.QueryRow(`
		SELECT session_id FROM sessions WHERE user_UUID = ?`,
		session.UserUUID,
	).Scan(&existingSession.SessionID)

	if err != nil && err != sql.ErrNoRows {
		return err // Return any error except "no rows found"
	}

	if err == sql.ErrNoRows {
		// No existing session, insert a new one
		_, err = DB.Exec(`
			INSERT INTO sessions (session_id, user_UUID, expires_at)
			VALUES (?, ?, ?);`,
			session.SessionID, session.UserUUID, session.Expires_at.Format("2006-01-02 15:04:05"),
		)
	} else {
		// Existing session found, replace it
		_, err = DB.Exec(`
			UPDATE sessions
			SET session_id = ?, expires_at = ?
			WHERE user_UUID = ?;`,
			session.SessionID, session.Expires_at.Format("2006-01-02 15:04:05"), session.UserUUID,
		)
	}

	return err
}
