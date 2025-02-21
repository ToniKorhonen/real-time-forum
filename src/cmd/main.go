package main

import (
	data "real-time-forum/src/api/Data"
	"real-time-forum/src/api/server"
)

func main() {
	db := data.InitDb()
	defer db.Close()

	server.StartHTTPServer()
}
