import { nanoid } from "nanoid";
export type RequestHistory = {
  key: string;
  emitName: string;
  title: string;
  request: any;
  response: any;
};

const storageKey = 'history';
export const saveRequest = (request: any, response: any, emitName: string, title:string) => {
    const requestsHistory = localStorage.getItem(storageKey);
    if (requestsHistory) {
      const arr: any[] = JSON.parse(requestsHistory);
      arr.push({ key: nanoid(3), emitName, title, request, response });
      localStorage.setItem(storageKey, JSON.stringify(arr));
    } else {
      const data = [{ key: nanoid(3), emitName, title, request, response }];
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
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