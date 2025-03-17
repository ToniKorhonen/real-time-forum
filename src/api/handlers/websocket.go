package handlers

import (
	"fmt"
	"net/http"
	"sync"

	// Import the data package
	data "real-time-forum/src/api/Data"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]*data.User) // Connected clients
var broadcast = make(chan data.Message)            // Broadcast channel
var users = make(map[string]*websocket.Conn)       // Connected users
var mutex = &sync.Mutex{}                          // Mutex for synchronizing access

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not open websocket connection", http.StatusBadRequest)
		return
	}
	defer conn.Close()

	userUUID, err := data.GetCurrentUserID(r)
	if err != nil {
		http.Error(w, "User not logged in", http.StatusUnauthorized)
		return
	}

	user, err := data.GetUserByUUID(userUUID)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Register the client
	mutex.Lock()
	clients[conn] = user
	users[string(user.ID)] = conn
	mutex.Unlock()

	for {
		var msg data.Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Read error: ", err)
			mutex.Lock()
			delete(clients, conn)
			mutex.Unlock()
			break
		}
		broadcast <- msg
	}
}

func handleMessages() {
	for {
		msg := <-broadcast
		mutex.Lock()
		for client, user := range clients {
			if string(user.ID) == string(msg.ReceiverID) {
				err := client.WriteJSON(msg)
				if err != nil {
					fmt.Println("Write error: ", err)
					client.Close()
					delete(clients, client)
				}
			}
		}
		mutex.Unlock()
	}
}

func init() {
	go handleMessages()
}
