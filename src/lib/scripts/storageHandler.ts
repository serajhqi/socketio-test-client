import { nanoid } from "nanoid";
export type RequestHistory = {
  key: string;
  emitName: string;
  title: string;
  request: any;
  response: any;
};

const storageKey = 'history';
export const saveRequest = (request: any, response: any, emitName: string, title:string):RequestHistory => {
    const requestsHistory = localStorage.getItem(storageKey);
    const key = nanoid(4);
    let arr: any[];
    if (requestsHistory) {
      arr = JSON.parse(requestsHistory);
      arr.push({ key, emitName, title, request, response });
    } else {
      arr = [{ key, emitName, title, request, response }];
    }
    localStorage.setItem(storageKey, JSON.stringify(arr));
    return { key, emitName, title, request, response }
  };

export const removeRequest = (requestKey: string) => {
    const requestsHistory: string | null = localStorage.getItem(storageKey);
    let arr: RequestHistory[] = requestsHistory && JSON.parse(requestsHistory);
    arr = arr.filter((item) => item.key !== requestKey);
    localStorage.setItem(storageKey, JSON.stringify(arr));
};
export const readItems = (): RequestHistory[]|undefined => {
  const requestsHistory = localStorage.getItem(storageKey);
  if (requestsHistory) {
   return JSON.parse(requestsHistory);
  } else return;
};