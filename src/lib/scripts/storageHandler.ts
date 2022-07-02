import { get } from "svelte/store";
import { requestHistory, RequestType } from "../store";

export const historyStorageKey = 'history';
export const saveRequest = () => {
    localStorage.setItem(historyStorageKey, JSON.stringify(get(requestHistory)));
};

export const removeRequest = (requestKey: string) => {
    const requestsHistory: string | null = localStorage.getItem(historyStorageKey);
    let arr: RequestType[] = requestsHistory && JSON.parse(requestsHistory);
    arr = arr.filter((item) => item.title !== requestKey);
    localStorage.setItem(historyStorageKey, JSON.stringify(arr));
};
export const readItems = (): RequestType[]|undefined => {
  // const requestsHistory = localStorage.getItem(historyStorageKey);
  return JSON.parse(localStorage.getItem(historyStorageKey));
};