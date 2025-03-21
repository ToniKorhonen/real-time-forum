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

var clients = make(map[*websocket.Conn]string)     // Maps connection → userID
var usersOnline = make(map[string]*websocket.Conn) // Maps userID → connection
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
	mutex.Unlock()

	fmt.Println("User connected:", user.Username)

	// Send past messages on connection
	username := user.Username
	sendPastMessages(conn, username)

	defer func() {
		mutex.Lock()
		delete(clients, conn)
		delete(usersOnline, user.Username)
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
		data.SaveMessage(msg.SenderID, msg.ReceiverID, msg.Content)

		mutex.Lock()
		receiverConn, receiverOnline := usersOnline[msg.ReceiverID]
		senderConn := usersOnline[msg.SenderID] // Ensure sender also receives message
		mutex.Unlock()

		// Send the message to the receiver if online
		if receiverOnline {
			err = receiverConn.WriteJSON(msg)
			if err != nil {
				fmt.Println("Error sending message to receiver:", err)
			}
		} else {
			fmt.Println("User", msg.ReceiverID, "is offline. Message saved in DB.")
		}

		// Ensure the sender also sees their own sent message in real time
		if senderConn != nil {
			err = senderConn.WriteJSON(msg)
			if err != nil {
				fmt.Println("Error sending message to sender:", err)
			}
		}
	}
}

func sendPastMessages(conn *websocket.Conn, username string) {
	messages, err := data.GetUserMessages(username)
	if err != nil {
		fmt.Println("Error fetching past messages:", err)
		return
	}

	for _, msg := range messages {
		err := conn.WriteJSON(msg)
		if err != nil {
			fmt.Println("Error sending past message:", err)
		}
	}
}
