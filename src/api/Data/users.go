package data

import (
	"errors"
	"strings"
)

func InsertUser(user *User) error {

	_, err := DB.Exec(`
	INSERT INTO users (
		"uuid",
		"username",
		"password",
		"email",
		"firstName",
		"lastName",
		"age",
		"gender",
	)
		VALUES (?,?,?,?,?,?);`, user.ID, user.Username, user.Password, strings.ToLower(user.Email), user.FirstName, user.LastName, user.Age, user.Gender)

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
