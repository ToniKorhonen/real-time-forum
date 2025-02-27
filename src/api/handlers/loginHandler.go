package handlers

import (
	"encoding/json"
	"net/http"
	data "real-time-forum/src/api/Data"
	"real-time-forum/src/api/middleware"
)

func handleLogin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json") // Ensure JSON response

	if r.Method == http.MethodPost {
		err := r.ParseForm()
		if err != nil {
			http.Error(w, "Error parsing form", http.StatusBadRequest)
			return
		}
	}

	emailOrUsername := r.FormValue("username_or_email")
	Password := r.FormValue("password")

	if emailOrUsername == "" || Password == "" {

	}

	if emailOrUsername != "" {
		user, err := data.GetUserByEmailOrUsername(emailOrUsername)
		if err != nil || !middleware.ComparePassword(Password, user) {
			return
		}

		middleware.Cookie(w, user)
		json.NewEncoder(w).Encode(user)
	}

}
