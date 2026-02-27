import { writable, Writable, derived } from 'svelte/store';
export type ConnectionStatus = 'connected'|'connecting'|'disconnecting'|'disconnected';
export type RequestType = {
    emitName: string;
    title: string;
    body?: any;
    response?: any;
    duration?: number;
  };

export type ListenerType = {
  title:string, 
  messages:{
    id:string;
    time:string;
    text:string | Record<string,any>;
  }[]
}
export type LogType = {time:string, message:string, id:string}
export const serverSettings: Writable<{address:string|null, path?: string, status: ConnectionStatus,options: Record<string,any>, id?:string}> = writable({address:null,path: "",status: 'disconnected', options: {}});
export const request:Writable<RequestType> = writable({title:null,emitName:null, body:undefined, response:undefined, duration: undefined});
export const requestHistory: Writable<RequestType[]|undefined> = writable([]);
export const requestInFocus = derived(request, $req => $req.title);
export const logs: Writable<LogType[]> = writable([]);
export const listeners: Writable<ListenerType[]> = writable([]);
export const repoStars: Writable<number> = writable(0);
export const appVersion: Writable<string> = writable();
