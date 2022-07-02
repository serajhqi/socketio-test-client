import { nanoid } from "nanoid";
export type RequestHistory = {
  emitName: string;
  title?: string;
  body: any;
  response: any;
};
export type SavedRequestHistory = {
  key: string;
  emitName: string;
  title: string;
  body: any;
  response: any;
};

const storageKey = 'history';
export const saveRequest = (request:RequestHistory) => {
    const requestsHistory = localStorage.getItem(storageKey);
    const key = nanoid(4);
    let arr: any[];
    if (requestsHistory) {
      arr = JSON.parse(requestsHistory);
      arr.push({ ...request, key });
    } else {
      arr = [{ ...request, key }];
    }
    localStorage.setItem(storageKey, JSON.stringify(arr));
    return { ...request, key }
  };

export const removeRequest = (requestKey: string) => {
    const requestsHistory: string | null = localStorage.getItem(storageKey);
    let arr: SavedRequestHistory[] = requestsHistory && JSON.parse(requestsHistory);
    arr = arr.filter((item) => item.key !== requestKey);
    localStorage.setItem(storageKey, JSON.stringify(arr));
};
export const readItems = (): SavedRequestHistory[]|undefined => {
  const requestsHistory = localStorage.getItem(storageKey);
  if (requestsHistory) {
   return JSON.parse(requestsHistory);
  } else return;
};