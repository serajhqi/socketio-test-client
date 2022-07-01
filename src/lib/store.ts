import { writable, Writable } from 'svelte/store';
export type ConnectionStatus = 'connected'|'connecting'|'disconnecting'|'disconnected';
import type {RequestHistory} from './scripts/storageHandler';

export const serverAddress: Writable<string> = writable(null);
export const connectionStatus: Writable<ConnectionStatus> = writable('disconnected');

export const request:Writable<{title:string, emitName:string, body: any, response:any}> = writable({title:null,emitName:null, body:null, response:null})
export const history: Writable<RequestHistory[]|undefined> = writable([]);