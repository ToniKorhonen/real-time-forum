package handlers

import (
	"net/http"
)

func InitRoutes() *http.ServeMux {
	mux := http.NewServeMux()

	// Correct the static file path and URL prefix
	fs := http.FileServer(http.Dir("../Frontend/static"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	// Define handlers
	mux.HandleFunc("/ws", HandleWebSocket)
	mux.HandleFunc("/login", handleLogin)
	mux.HandleFunc("/api/user", handleUserData)
	mux.HandleFunc("/api/online-users", handleOnlineUsers)
	mux.HandleFunc("/api/messages", handleGetMessages) // New endpoint for fetching messages

	mux.HandleFunc("/register", handleRegister)
	mux.HandleFunc("/logout", handleLogout)
	mux.HandleFunc("/createpost", handlePost)
	mux.HandleFunc("/posts", getPosts)
	mux.HandleFunc("/chat", handleChat)
	mux.HandleFunc("/", handleIndex)

	return mux
}
