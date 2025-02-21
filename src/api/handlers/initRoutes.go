package handlers

import "net/http"

func InitRoutes() *http.ServeMux {
	mux := http.NewServeMux()

	fs := http.FileServer(http.Dir("Frontend/static"))
	mux.Handle("/static/", http.StripPrefix("/static/", fs))

	mux.HandleFunc("/ws", handleWebSocket)
	mux.HandleFunc("/", handleIndex)

	return mux
}
