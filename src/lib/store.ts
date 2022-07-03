import { writable, Writable, derived } from 'svelte/store';
export type ConnectionStatus = 'connected'|'connecting'|'disconnecting'|'disconnected';
export type RequestType = {
    emitName: string;
    title: string;
    body?: any;
    response?: any;
  };
export const serverSettings: Writable<{address:string|null, status: ConnectionStatus, id?:string}> = writable({address:null,status: 'disconnected'});
export const request:Writable<RequestType> = writable({title:null,emitName:null, body:undefined, response:undefined})
export const requestHistory: Writable<RequestType[]|undefined> = writable([]);
export const requestInFocus = derived(request, $req => $req.title);