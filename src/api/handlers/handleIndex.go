package handlers

import (
	"net/http"
	data "real-time-forum/src/api/Data"
)

func handleIndex(w http.ResponseWriter, r *http.Request) {
	p := data.Page{
		Title: "App",
	}
	RenderTemplate(w, "index.html", p)
}
