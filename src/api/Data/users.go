package data

import (
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"strings"
)

func InsertUser(user *User) error {

	_, err := DB.Exec(`
	INSERT INTO users (
		"uuid",
		"username",
		"email",
		"password",
		"firstName",
		"lastName",
		"age",
		"gender"
	)
		VALUES (?,?,?,?,?,?,?,?);`, user.ID, user.Username, strings.ToLower(user.Email), user.Password, user.FirstName, user.LastName, user.Age, user.Gender)

	if err != nil {
		if strings.Contains(err.Error(), "UNIQUE constraint failed: users.email") {
			return errors.New("Email already used, try to connect")
		}
		if strings.Contains(err.Error(), "UNIQUE constraint failed: users.username") {
			return errors.New("Username already used")
		}
	}
	return nil
}

// Search for a user in the database using his UUID
func GetUserByUUID(uuid []byte) (*User, error) {
	user := User{}
	user_rows, err := DB.Query("SELECT * FROM users WHERE uuid = ?", uuid)
	if err != nil {
		return &User{}, errors.New("Unvalid Identifier")
	}
	for user_rows.Next() {
		err := user_rows.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.FirstName, &user.LastName, &user.Age, &user.Gender)
		if err != nil {
			fmt.Print(err)
			return &User{}, errors.New("Unvalid Identifier")
		}
	}
	return &user, nil
}

// Get the connected user UUID
func GetCurrentUserID(r *http.Request) ([]byte, error) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		return nil, errors.New("User not logged in")
	}
	decodedSession, err := base64.StdEncoding.DecodeString(cookie.Value)
	if err != nil {
		return nil, errors.New("Invalid session ID")
	}

	var userUUID []byte

	err = DB.QueryRow(`
	SELECT user_UUID FROM sessions WHERE session_id = ?`,
		decodedSession,
	).Scan(&userUUID)

	return userUUID, nil
}

func GetUserByEmailOrUsername(identifier string) (*User, error) {
	user := User{}

	// Query for user by either email or username
	userRows, err := DB.Query(`SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR LOWER(username) = LOWER(?);`, identifier, identifier)
	if err != nil {
		return nil, errors.New("Invalid identifier")
	}
	defer userRows.Close() // Ensure rows are closed properly

	// Fetch the user data
	if userRows.Next() {
		err := userRows.Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.FirstName, &user.LastName, &user.Age, &user.Gender)
		if err != nil {
			fmt.Print(err)
			return nil, errors.New("Invalid identifier")
		}
		return &user, nil
	}

	return nil, errors.New("User not found")
}
