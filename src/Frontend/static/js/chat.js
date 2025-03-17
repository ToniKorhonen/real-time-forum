async function usersOnline() {
    const content = document.getElementById("content");
    const onlineUsersContainer = document.createElement("div");
    onlineUsersContainer.innerHTML = `<p>Users Online</p>`;

    const usersList = document.createElement("ul");
    usersList.id = "users-online";

    try {
        const response = await fetch("/api/online-users");
        if (!response.ok) throw new Error("Failed to fetch online users");

        const onlineUsers = await response.json();

        // Populate the users list
        onlineUsers.forEach(user => {
            const listItem = document.createElement("li");
            listItem.textContent = user.Username; // Ensure the backend sends `username`
            usersList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching online users:", error);
    }

    onlineUsersContainer.appendChild(usersList);
    content.appendChild(onlineUsersContainer);
}

export { usersOnline };
