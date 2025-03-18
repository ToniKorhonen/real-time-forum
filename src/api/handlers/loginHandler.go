package handlers

import (
	"fmt"
	"net/http"
	data "real-time-forum/src/api/Data"
	"real-time-forum/src/api/middleware"
)

func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Parse the form inputs
	err := r.ParseForm()
	if err != nil {
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}

	emailOrUsername := r.FormValue("username_or_email")
	password := r.FormValue("password")

	fmt.Println("Received login request - Email/Username:", emailOrUsername, "Password:", password)

	if emailOrUsername == "" || password == "" {
		http.Error(w, "Missing credentials", http.StatusBadRequest)
		return
	}

	// Retrieve user by email or username (Make sure this returns a User with ID as string)
	user, err := data.GetUserByEmailOrUsername(emailOrUsername)
	if err != nil {
		fmt.Println("User not found:", emailOrUsername)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Compare password
	if !middleware.ComparePassword(password, user) {
		fmt.Println("Password mismatch for user:", emailOrUsername)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Set session cookie
	middleware.Cookie(w, user)
	data.SetUserOnline(user.Username)

	fmt.Println("Login successful for user:", emailOrUsername)
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Login successful")
}
