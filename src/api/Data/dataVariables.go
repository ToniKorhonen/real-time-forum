package data

import "database/sql"

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

var DB *sql.DB
