package data

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func InitDb() *sql.DB {
	// Code to initialize the database
	database, err := sql.Open("sqlite3", "../api/Data/forum.db")
	if err != nil {
		log.Fatal(err)
	}

	DB = database

	createUserTable :=
		`CREATE TABLE IF NOT EXISTS users (
    "uuid" TEXT NOT NULL PRIMARY KEY UNIQUE,
    "username" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL UNIQUE,
    "password" BLOB NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL
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

	createMessagesTable := `
	CREATE TABLE IF NOT EXISTS messages (
		"MessID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		"senderID" BLOB NOT NULL,
		"receiverID" BLOB NOT NULL,
		"content" TEXT NOT NULL,
		"date" TIMESTAMP NOT NULL,
		FOREIGN KEY("senderID") REFERENCES users("uuid") ON DELETE CASCADE,
		FOREIGN KEY("receiverID") REFERENCES users("uuid") ON DELETE CASCADE
	);`
	_, err = database.Exec(createMessagesTable)
	if err != nil {
		log.Fatal(err)
	}

	// Adding back the Posts Table (NO OTHER CHANGES)
	createPostsTable := `
	CREATE TABLE IF NOT EXISTS posts (
		"id" INTEGER PRIMARY KEY AUTOINCREMENT,
		"title" TEXT NOT NULL,
		"content" TEXT NOT NULL,
		"category" TEXT NOT NULL,
		"user_id" BLOB DEFAULT NULL,
		"created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		"likes_count" INTEGER DEFAULT 0,
		"dislikes_count" INTEGER DEFAULT 0,
		"comments_count" INTEGER DEFAULT 0,
		FOREIGN KEY("user_id") REFERENCES users("uuid") ON DELETE CASCADE
	);`
	_, err = database.Exec(createPostsTable)
	if err != nil {
		log.Fatal(err)
	}

	return database
}
