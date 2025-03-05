package data

import (
	"database/sql"
	"time"
)

// Page is just an example container for rendering templates/pages.
type Page struct {
	Title string
	Error string
	User  *User
	Data  interface{}
}

// User holds user info.
// IMPORTANT: ID is now a string, not []byte.
type User struct {
	ID        string
	Username  string
	Email     string
	Password  []byte // Keep password as bytes for secure hashing/storage.
	FirstName string
	LastName  string
	Age       int
	Gender    string
}

// Session stores session-related info.
// IMPORTANT: UserUUID is now a string.
type Session struct {
	SessionID  string
	UserUUID   string
	Expires_at time.Time
}

// DB is your global database handle.
var DB *sql.DB
