# 🧵 Real-Time Forum

**Real-Time Forum** is a lightweight but impactful project created to explore real-time web communication using **WebSockets**. This project was my **first real-time implementation**, built entirely to understand how live interactions, messaging, and synchronization between users work on a modern web platform.

There’s no advanced UI design or complex structure — the **core focus** was simple: _make real-time communication work properly_.

---

## 🧠 Project Overview

This forum allows multiple users to:

- 🔓 Register, login, and log out
- 📬 Post messages under specific categories
- 💬 Comment on other users' posts
- 👀 View the shared live post feed
- 🟢 See who's online in real-time
- ✍️ Detect when other users are typing
- ⚡ Instantly broadcast messages and comments to all connected users

All of this is powered by **Go’s native WebSocket support**, which handles bi-directional connections and live updates between clients and the server.

---

## 💬 Key Features

### 🟢 Real-Time Messaging

Messages posted or commented are **broadcast instantly** to all connected users, appearing live on their screens without refreshing.

### ✍️ Typing Indicators

The interface detects when a user is actively typing, showing a _“typing…”_ status to others. This simulates familiar UX from modern chat and forum apps.

### 🧪 First Real-Time Experiment

This was my first time working with:

- `WebSocket` protocols and client lifecycle
- Managing multiple live connections on the backend
- Broadcasting live events and syncing UI
- Detecting and synchronizing **typing activity**

It served as a practical crash course in **asynchronous communication** and **event-driven architecture**.

---

## 🚀 How to Use

### 📦 Run Locally

1. Navigate to the `cmd` folder of the project in your terminal.
2. Launch the Go server with:

   ```bash
   go run main.go

3. Open your browser and go to:

`
        http://localhost:8080
`

4. Open multiple tabs or devices to simulate several users interacting in real time.

---

## 🔧 Technical Stack

- **Backend:** Go (`net/http`, `gorilla/websocket`)
- **Frontend:** HTML & Vanilla JS (no frameworks)
- **Architecture:** Central Hub with Go channels for:
- Message events
- Typing state detection
- Connection lifecycle handling

---

## 🧠 What I Learned

- Real-time systems rely on managing many open connections efficiently
- Broadcasting events without race conditions is key to sync
- Small projects like this are **great for mastering core backend concepts**
- Typing indicators and online status are harder than they look — they require subtle but precise synchronization

---

## ✅ Conclusion

This forum helped me internalize **real-time backend logic**, sharpen my **Go skills**, and gain confidence with WebSockets.

Even without a visual polish, this was a **turning point** in how I approach backend logic and user experience. It laid the groundwork for future work in collaborative apps, chat systems, and multiplayer logic.


---

👉 **Check out the repository:** [github.com/Kindroky/real-time-forum](https://github.com/Kindroky/real-time-forum)

