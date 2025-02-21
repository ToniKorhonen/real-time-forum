package data

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func InitDb() *sql.DB {
	// Code to initialize the database
	database, err := sql.Open("sqlite3", "src/api/Data/forum.db")
	if err != nil {
		log.Fatal(err)
	}

	createUserTable :=
		`CREATE TABLE IF NOT EXISTS users (
		"uuid" BLOB NOT NULL PRIMARY KEY UNIQUE,
		"nickname" TEXT NOT NULL UNIQUE,
		"email" TEXT NOT NULL UNIQUE,
		"password" BLOB NOT NULL,
		"Age" INTEGER NOT NULL,
		"Gender" TEXT NOT NULL
		"FirstName" TEXT NOT NULL,
		"LastName" TEXT NOT NULL,
	);`
	_, err = database.Exec(createUserTable)
	if err != nil {
		log.Fatal(err)
	}

	createSessionTable := `
	CREATE TABLE IF NOT EXISTS sessions (
		"session_id" BLOB NOT NULL PRIMARY KEY UNIQUE,
		"user_UUID" BLOB NOT NULL,
		"expires_at" TIMESTAMP,
		FOREIGN KEY("user_uuid") REFERENCES users("uuid") ON DELETE CASCADE
	);`

	_, err = database.Exec(createSessionTable)
	if err != nil {
		log.Fatal(err)
	}

	return database
}
