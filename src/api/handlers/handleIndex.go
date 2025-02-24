package handlers

import (
	"net/http"
	data "real-time-forum/src/api/Data"
)

func handleIndex(w http.ResponseWriter, r *http.Request) {
	// Code to handle the index route

	p := data.Page{
		Title: "App", // Title of the page
	}
	RenderTemplate(w, "index.html", p)
}
