async function usersOnline() {
    const content = document.getElementById("content");
    const onlineUsersContainer = document.createElement("div");
    onlineUsersContainer.innerHTML = `<p>Users Online</p>`;

    const usersList = document.createElement("ul");
    usersList.id = "users-online";

    try {
        const response = await fetch("/api/online-users");
        if (!response.ok) throw new Error("Failed to fetch online users");

        const onlineUsers = await response.json(); // onlineUsers is now just an array of strings

        // Populate the users list
        onlineUsers.forEach(username => {  // No more user.Username, just username
            const listItem = document.createElement("li");
            listItem.textContent = username; 
            usersList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching online users:", error);
    }

    onlineUsersContainer.appendChild(usersList);
    content.appendChild(onlineUsersContainer);
}

export { usersOnline };

