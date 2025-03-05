package data

import (
	"database/sql"
	"errors"
	"fmt"
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

func GetUserByUUID(userUUID string) (*User, error) {
	user := &User{}
	// Adjust columns and table name to match your DB schema.
	err := DB.QueryRow(`
        SELECT uuid, username, email, password, firstName, lastName, age, gender
        FROM users
        WHERE uuid = ?`,
		userUUID,
	).Scan(
		&user.ID,
		&user.Username,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.Age,
		&user.Gender,
	)

	if err != nil {
		fmt.Println("Error fetching user:", err)
		return nil, err
	}
	return user, nil
}

// GetUserByEmailOrUsername retrieves a user by email or username
func GetUserByEmailOrUsername(input string) (*User, error) {
	var user User

	query := `SELECT uuid, username, email, password FROM users WHERE email = ? OR username = ?`
	err := DB.QueryRow(query, input, input).Scan(&user.ID, &user.Username, &user.Email, &user.Password)

	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	return &user, nil
}
