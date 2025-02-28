package handlers

import (
	"fmt"
	"net/http"
	data "real-time-forum/src/api/Data"
	"real-time-forum/src/api/middleware"
)

func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, "Error parsing form", http.StatusBadRequest)
			return
		}
		emailOrUsername := r.FormValue("username_or_email")
		Password := r.FormValue("password")

		fmt.Println(emailOrUsername, Password)

		if emailOrUsername != "" {
			user, err := data.GetUserByEmailOrUsername(emailOrUsername)
			if err != nil || !middleware.ComparePassword(Password, user) {
				http.Error(w, "Invalid credentials", http.StatusUnauthorized)
				return
			}

			middleware.Cookie(w, user)
			w.WriteHeader(http.StatusOK)
		}

		// if emailOrUsername == "" || Password == "" {

		// }

	}

}
