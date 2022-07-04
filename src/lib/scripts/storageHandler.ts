import { get } from "svelte/store";
import { requestHistory, RequestType, listeners, ListenerType } from "../store";

export const historyStorageKey = 'history';
export const listenersStorageKey = 'listeners';

export const saveRequest = () => {
    localStorage.setItem(historyStorageKey, JSON.stringify(get(requestHistory)));
};
export const saveListeners = () => {
    localStorage.setItem(listenersStorageKey, JSON.stringify(get(listeners)));
};
export const removeListener = (listenerKey: string) => {
    const _listeners: string | null = localStorage.getItem(listenersStorageKey);
    let arr: ListenerType[] = _listeners && JSON.parse(_listeners);
    arr = arr.filter((item) => item.title !== listenerKey);
    localStorage.setItem(listenersStorageKey, JSON.stringify(arr));
};

export const removeRequest = (requestKey: string) => {
    const requestsHistory: string | null = localStorage.getItem(historyStorageKey);
    let arr: RequestType[] = requestsHistory && JSON.parse(requestsHistory);
    arr = arr.filter((item) => item.title !== requestKey);
    localStorage.setItem(historyStorageKey, JSON.stringify(arr));
};
export function readItems<T>(key:'history'|'listeners'): T[]|undefined  {
  return JSON.parse(localStorage.getItem(key));
};