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

// Retrieve messages between two users
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
	fmt.Println(messages)
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
