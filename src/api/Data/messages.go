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

// Get conversation between two specific users with pagination
func GetConversation(user1, user2 string, limit, offset int) ([]Message, int, error) {
	// Get total message count
	countQuery := `
        SELECT COUNT(*) FROM messages
        WHERE (senderID = ? AND receiverID = ?) OR (senderID = ? AND receiverID = ?)
    `
	var total int
	err := DB.QueryRow(countQuery, user1, user2, user2, user1).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Fetch latest messages first (descending)
	query := `
        SELECT senderID, receiverID, content, date FROM messages
        WHERE (senderID = ? AND receiverID = ?) OR (senderID = ? AND receiverID = ?)
        ORDER BY date DESC
        LIMIT ? OFFSET ?
    `
	rows, err := DB.Query(query, user1, user2, user2, user1, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var msg Message
		err := rows.Scan(&msg.SenderID, &msg.ReceiverID, &msg.Content, &msg.Timestamp)
		if err != nil {
			return nil, 0, err
		}
		messages = append(messages, msg)
	}

	return messages, total, nil
}
