package middleware

import (
	data "real-time-forum/src/api/Data"

	"golang.org/x/crypto/bcrypt"
)

func PasswordEncrypt(password string) []byte {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), 15)
	if err != nil {
	}
	return hashed
}

func ComparePassword(password string, user *data.User) bool {
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return false
	}
	return true
}
