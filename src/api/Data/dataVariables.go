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

type Post struct {
	ID            int       `json:"id"`
	Title         string    `json:"title"`
	Content       string    `json:"content"`
	Category      string    `json:"category"`
	UserID        string    `json:"user_id"`
	CreatedAt     time.Time `json:"created_at"`
	LikesCount    int       `json:"likes_count"`
	DislikesCount int       `json:"dislikes_count"`
	CommentsCount int       `json:"comments_count"`
}

type Comment struct {
	ID        int       `json:"id"`
	PostID    int       `json:"post_id"`
	UserID    string    `json:"user_id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

// DB is your global database handle.
var DB *sql.DB
