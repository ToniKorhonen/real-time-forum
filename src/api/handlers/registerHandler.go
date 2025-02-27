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
	var errorMessages []string
	var user data.User
	w.Header().Set("Content-Type", "application/json") // Ensure JSON response

	if r.Method == http.MethodPost {
		err := r.ParseForm()
		if err != nil {
			errorMessages = append(errorMessages, "Error parsing form")
			return
		} else {
			username := r.FormValue("username")
			email := r.FormValue("email")
			password := r.FormValue("password")
			firstName := r.FormValue("firstName")
			lastName := r.FormValue("lastName")
			ageStr := r.FormValue("age")
			gender := r.FormValue("gender")

			usernameErrors := middleware.IsValidUsername(username)
			if len(usernameErrors) > 0 {
				errorMessages = append(errorMessages, usernameErrors...)
			}

			emailErrors := middleware.IsValidEmail(email)
			if len(emailErrors) > 0 {
				errorMessages = append(errorMessages, emailErrors...)
			}
			passwordErrors := middleware.ValidatePassword(password)
			if len(passwordErrors) > 0 {
				errorMessages = append(errorMessages, passwordErrors...)
			}

			age, err := strconv.Atoi(ageStr)
			if err != nil {
				errorMessages = append(errorMessages, "Invalid age format")
			}
			fmt.Println(username, email, password, firstName, lastName, age, gender)

			ageErrors := middleware.IsValidAge(age)
			if len(ageErrors) > 0 {
				errorMessages = append(errorMessages, ageErrors...)
			}

			// Print out the error messages for debugging
			fmt.Println("Errors: ", errorMessages)

			// If there are no errors, proceed with registration
			if len(errorMessages) == 0 {
				user = data.User{
					ID:        []byte(middleware.GenerateUUID()),
					Username:  username,
					Email:     email,
					Password:  middleware.PasswordEncrypt(password), // Encrypt password here
					FirstName: firstName,
					LastName:  lastName,
					Age:       age,
					Gender:    gender,
				}

				// Print the user details for debugging
				fmt.Println(user)

				// Insert the user into the database
				err = data.InsertUser(&user)
				if err != nil {
					http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
					return
				} else {
					middleware.Cookie(w, &user)
				}

				json.NewEncoder(w).Encode(user)

				// Send a success response
				w.WriteHeader(http.StatusOK)
				w.Write([]byte("Registration successful"))
			}
		}
	}
}
