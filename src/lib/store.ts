import { writable } from 'svelte/store';

export const serverAddress = writable(null);
export const serverActive = writable(false);
export const eventName = writable(null);