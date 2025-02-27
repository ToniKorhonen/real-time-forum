package data

import (
	"database/sql"
	"time"
)

type Page struct {
	Title string
	Error string
	User  User
	Data  interface{}
}

type User struct {
	ID        []byte
	Username  string
	Email     string
	Password  []byte
	FirstName string
	LastName  string
	Age       int
	Gender    string
}

type Session struct {
	SessionID  []byte
	UserUUID   []byte
	Expires_at time.Time
}

var DB *sql.DB
