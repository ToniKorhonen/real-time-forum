package main

import (
	"log"
	data "real-time-forum/src/api/Data"
	"real-time-forum/src/api/server"
)

func main() {
	data.InitDb()

	log.Println("Server running on http://localhost:8080")
	server.StartHTTPServer()
}
