package data

import (
	"fmt"
	"time"
)

func SaveMessage(senderID, receiverID, content string) error {
	query := `
        INSERT INTO messages (senderID, receiverID, content, date)
        VALUES (?, ?, ?, ?)
    `
	_, err := DB.Exec(query, senderID, receiverID, content, time.Now())
	if err != nil {
		fmt.Println("Error saving message:", err)
	}
	return err
}

// Retrieve all messages for a specific user (sent or received)
func GetUserMessages(username string) ([]Message, error) {
	query := `
        SELECT senderID, receiverID, content, date FROM messages
        WHERE senderID = ? OR receiverID = ?
        ORDER BY date ASC
    `
	rows, err := DB.Query(query, username, username)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var msg Message
		err := rows.Scan(&msg.SenderID, &msg.ReceiverID, &msg.Content, &msg.Timestamp)
		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}
	return messages, nil
}

// Get conversation between two specific users
func GetConversation(user1, user2 string) ([]Message, error) {
	query := `
        SELECT senderID, receiverID, content, date FROM messages
        WHERE (senderID = ? AND receiverID = ?) OR (senderID = ? AND receiverID = ?)
        ORDER BY date ASC
    `
	rows, err := DB.Query(query, user1, user2, user2, user1)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var msg Message
		err := rows.Scan(&msg.SenderID, &msg.ReceiverID, &msg.Content, &msg.Timestamp)
		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}

	fmt.Printf("Found %d messages between %s and %s\n", len(messages), user1, user2)
	return messages, nil
}
