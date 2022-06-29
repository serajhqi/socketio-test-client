import { writable, Writable } from 'svelte/store';
export type ConnectionStatus = 'connected'|'connecting'|'disconnecting'|'disconnected';

export const serverAddress: Writable<string> = writable(null);
export const connectionStatus: Writable<ConnectionStatus> = writable('disconnected');
export const eventName:Writable<string> = writable(null);