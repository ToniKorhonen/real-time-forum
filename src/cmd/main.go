package main

import (
	"net/http"
	"log"
	data "real-time-forum/src/api/Data"
	"real-time-forum/src/api/server"
	"real-time-forum/src/api/handlers"
)

func main() {
	data.InitDb() 
	handlers.Init()
	http.HandleFunc("/createpost", handlers.CreatePostHandler)

	log.Println("Server running on http://localhost:8080")
	server.StartHTTPServer()
}

