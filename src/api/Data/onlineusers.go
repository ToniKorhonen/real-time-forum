package data

import (
	"sync"
)

var (
	OnlineUsers = make(map[string]bool) // Maps user UUID to online status
	mu          sync.Mutex
)

// Mark user as online
func SetUserOnline(username string) {
	mu.Lock()
	OnlineUsers[username] = true
	mu.Unlock()
}

// Mark user as offline
func SetUserOffline(username string) {
	mu.Lock()
	delete(OnlineUsers, username)
	mu.Unlock()
}

// Get all online users
func GetOnlineUsers() []string {
	mu.Lock()
	users := make([]string, len(OnlineUsers))
	i := 0
	for username := range OnlineUsers {
		users[i] = username
		i++
	}
	mu.Unlock()
	return users
}
