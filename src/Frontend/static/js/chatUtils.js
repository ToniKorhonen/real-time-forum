export function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

export async function fetchMessagesPage(currentUser, otherUser, offset, pageSize = 10) {
    const response = await fetch(`/api/messages?user=${otherUser}&offset=${offset}&limit=${pageSize}`);
    if (!response.ok) throw new Error("Failed to fetch messages");

    const result = await response.json();
    const messages = result.messages.filter(
        msg =>
            (msg.senderID === currentUser && msg.receiverID === otherUser) ||
            (msg.senderID === otherUser && msg.receiverID === currentUser)
    );

    return {
        messages,
        offset: result.offset,
        total: result.total,
    };
}
