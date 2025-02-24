package server

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"real-time-forum/src/api/handlers"
	"syscall"
	"time"
)

// StartServer starts the HTTP server
type Config struct {
	Addr         string
	Handler      http.Handler
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

func StartHTTPServer() {
	// Initialize the templates

	handlers.InitTemplates()
	serverConfig := Config{
		Addr:         ":8080",
		Handler:      handlers.InitRoutes(), // The mux router
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}

	server := &http.Server{
		Addr:         serverConfig.Addr,
		Handler:      serverConfig.Handler,
		ReadTimeout:  serverConfig.ReadTimeout,
		WriteTimeout: serverConfig.WriteTimeout,
	}

	// Goroutine for graceful shutdown
	log.Println("Server started on: http://localhost" + server.Addr)
	go func() {
		if err := server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("HTTP server error: %v", err)
		}
		log.Println("Stopped serving new connections")
	}()

	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, syscall.SIGINT, syscall.SIGTERM)
	<-signalChan

	shutdownContext, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownContext); err != nil {
		log.Fatal("HTTP shutdown error:", err)
	}
	log.Println("Graceful shutdown complete")
}
