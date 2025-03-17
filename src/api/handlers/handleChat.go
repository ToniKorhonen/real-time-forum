package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	data "real-time-forum/src/api/Data"
)

func handleChat(w http.ResponseWriter, r *http.Request) {

}

func handleOnlineUsers(w http.ResponseWriter, r *http.Request) {
	query := "SELECT uuid, username, online FROM users WHERE online = true"
	rows, err := data.DB.Query(query)
	if err != nil {
		http.Error(w, "Error getting online users", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	users := []data.User{}
	for rows.Next() {
		var user data.User
		err := rows.Scan(&user.ID, &user.Username, &user.Online)
		if err != nil {
			http.Error(w, "Error scanning online users", http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	// Debug: Print the users before sending JSON response
	fmt.Println("Online Users:", users)

	w.Header().Set("Content-Type", "application/json")

	err = json.NewEncoder(w).Encode(users)
	if err != nil {
		http.Error(w, "Error encoding online users", http.StatusInternalServerError)
	}
}
