package handlers

import (
	"fmt"
	"net/http"
	data "real-time-forum/src/api/Data"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]string)
var usersOnline = make(map[string]*websocket.Conn)
var mutex = &sync.Mutex{}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	userID, err := data.GetCurrentUserID(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	user, err := data.GetUserByUUID(userID)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading connection:", err)
		return
	}

	mutex.Lock()
	clients[conn] = user.Username
	usersOnline[user.Username] = conn
	data.SetUserOnline(user.Username) // Mark user as online in the shared state
	mutex.Unlock()

	fmt.Println("User connected:", user.Username)

	// No longer sending past messages on connection
	// Past messages will be fetched when a chat is opened

	defer func() {
		mutex.Lock()
		delete(clients, conn)
		delete(usersOnline, user.Username)
		data.SetUserOffline(user.Username) // Mark user as offline in the shared state
		conn.Close()
		mutex.Unlock()
		fmt.Println("User disconnected:", user.Username)
	}()

	for {
		var msg data.Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Error reading message:", err)
			break
		}

		fmt.Println("Received message:", msg)

		// Save the message to the database
		err = data.SaveMessage(msg.SenderID, msg.ReceiverID, msg.Content)
		if err != nil {
			fmt.Println("Error saving message:", err)
		}

		mutex.Lock()
		receiverConn, receiverOnline := usersOnline[msg.ReceiverID]
		senderConn := usersOnline[msg.SenderID]
		mutex.Unlock()

		// Always send the message back to the sender
		if senderConn != nil {
			err = senderConn.WriteJSON(msg)
			if err != nil {
				fmt.Println("Error sending message to sender:", err)
			}
		}

		// Send the message to the receiver if online
		if receiverOnline {
			err = receiverConn.WriteJSON(msg)
			if err != nil {
				fmt.Println("Error sending message to receiver:", err)
			}
		} else {
			fmt.Println("User", msg.ReceiverID, "is offline. Message saved in DB.")
		}
	}
}
