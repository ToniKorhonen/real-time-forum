package data

import "database/sql"

type Page struct {
	Title string
	User  User
}

type User struct {
	ID        []byte
	Username  string
	Password  []byte
	Email     string
	FirstName string
	LastName  string
	Age       int
	Gender    string
}

var DB *sql.DB
