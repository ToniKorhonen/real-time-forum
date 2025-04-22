export const pageSize = 10;
export const chatState = {};

export function getCurrentUsername() {
    return document.querySelector('[data-current-user]')?.dataset.currentUser || "User";
}
