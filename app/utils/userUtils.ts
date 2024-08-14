import { v4 as uuidv4 } from 'uuid';

export function generateGuestUserId(): string {
    return uuidv4(); // Generates a unique identifier
}

export function getOrCreateGuestUserId(): string {
    let userId = localStorage.getItem('guestUserId');
    if (!userId) {
        userId = generateGuestUserId();
        localStorage.setItem('guestUserId', userId);
    }
    return userId;
}
