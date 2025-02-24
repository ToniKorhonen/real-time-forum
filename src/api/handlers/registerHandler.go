package handlers

import (
	"net/http"
	data "real-time-forum/src/api/Data"
	"real-time-forum/src/api/middleware"
	"strconv"
)

func handleRegister(w http.ResponseWriter, r *http.Request) {
	var errorMessages []string
	var user data.User

	if r.Method == http.MethodPost {
		err := r.ParseForm()
		if err != nil {
			errorMessages = append(errorMessages, "Error parsing form")
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
			ageErrors := middleware.IsValidAge(age)
			if len(ageErrors) > 0 {
				errorMessages = append(errorMessages, ageErrors...)
			}

			if len(errorMessages) == 0 {
				user = data.User{
					ID:        []byte(middleware.GenerateUUID()),
					Email:     email,
					Username:  username,
					Password:  middleware.PasswordEncrypt(password), // Encrypt password here with Password encrypt
					FirstName: firstName,
					LastName:  lastName,
					Age:       age,
					Gender:    gender,
				}
				err := data.InsertUser(&user)
				if err != nil {
					errorMessages = append(errorMessages, err.Error())
				} else {
					http.Redirect(w, r, "/login", http.StatusSeeOther)
				}
			}
		}
	}

}
