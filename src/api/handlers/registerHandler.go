package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	data "real-time-forum/src/api/Data"
	"real-time-forum/src/api/middleware"
	"strconv"
)

func handleRegister(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var errorMessages []string
	var user data.User

	if r.Method == http.MethodPost {
		err := r.ParseForm()
		if err != nil {
			errorMessages = append(errorMessages, "Error parsing form")
			http.Error(w, "Error parsing form", http.StatusBadRequest)
			return
		}

		username := r.FormValue("username")
		email := r.FormValue("email")
		password := r.FormValue("password")
		firstName := r.FormValue("firstName")
		lastName := r.FormValue("lastName")
		ageStr := r.FormValue("age")
		gender := r.FormValue("gender")

		// Validate username
		usernameErrors := middleware.IsValidUsername(username)
		if len(usernameErrors) > 0 {
			errorMessages = append(errorMessages, usernameErrors...)
		}

		// Validate email
		emailErrors := middleware.IsValidEmail(email)
		if len(emailErrors) > 0 {
			errorMessages = append(errorMessages, emailErrors...)
		}

		// Validate password
		passwordErrors := middleware.ValidatePassword(password)
		if len(passwordErrors) > 0 {
			errorMessages = append(errorMessages, passwordErrors...)
		}

		// Validate age
		age, err := strconv.Atoi(ageStr)
		if err != nil {
			errorMessages = append(errorMessages, "Invalid age format")
		}
		ageErrors := middleware.IsValidAge(age)
		if len(ageErrors) > 0 {
			errorMessages = append(errorMessages, ageErrors...)
		}

		fmt.Println("Errors: ", errorMessages)

		// If no errors, proceed with registration
		if len(errorMessages) == 0 {
			// GenerateUUID returns a string now
			newUUID := middleware.GenerateUUID()

			user = data.User{
				ID:        newUUID, // Use string, not []byte
				Username:  username,
				Email:     email,
				Password:  middleware.PasswordEncrypt(password),
				FirstName: firstName,
				LastName:  lastName,
				Age:       age,
				Gender:    gender,
			}

			// Insert the user into the database
			err = data.InsertUser(&user)
			if err != nil {
				http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
				return
			}
			middleware.Cookie(w, &user)

			// Send a success response
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(errorMessages)
			return
		}

		// Send an error response
		http.Error(w, "Registration failed", http.StatusBadRequest)
	}
}
