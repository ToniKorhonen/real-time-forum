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
	users := data.GetOnlineUsers()
	fmt.Println("Online users:", users)

	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(users)
}
