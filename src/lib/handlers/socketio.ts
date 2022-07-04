import { io, Socket } from "socket.io-client";
import { requestHistory, serverSettings, request, RequestType,logs, listeners } from "../store";
import { get } from "svelte/store";
import { saveRequest } from "./storage";
import { nanoid } from "nanoid";

const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

let socket: Socket | null = null;
export const toggleConnection = () => {
  try {
    const server = get(serverSettings);
    const {address,status} = get(serverSettings);

    if (status == "disconnected" ) {
      serverSettings.set({...server, status: 'connecting'})
      logger('connecting');

      socket = io(address);
      socket.connect();
      
      socket.on("connect", () => {
        serverSettings.set({...server, status: 'connected',id: socket.id});
        logger('connected');
      });
      socket.on("disconnect", () => {
        serverSettings.set({...server, status: 'disconnected', id:undefined})
        logger('disconnected');
      });
      socket.onAny((eventName, ...args) => {
        const _listeners = get(listeners);
        let listener = _listeners.find(item => item.title == eventName);
        if(listener){
          const index = _listeners.findIndex(item => item.title == eventName);
          listener = {...listener, messages:[...listener.messages, {id: nanoid(5), time: new Date().toISOString().slice(11, 19), text: args}]};
          _listeners[index] = listener;
          listeners.set(_listeners);
        }
        logger(eventName + ' ' + args);
        
      });
    } else if (status == "connected") {
      serverSettings.set({...server, status: 'disconnecting'})
      logger('disconnecting');

      socket?.disconnect();
      socket?.close();

      serverSettings.set({...server, status: 'disconnected', id:undefined})
      socket = null;
    }else if(status == "connecting" || status == "disconnecting"){
      socket?.disconnect();
      socket?.close();

      serverSettings.set({...server, status: 'disconnected', id:undefined})
      socket = null;
    }
  } catch (e) {
    console.log(e);
    // logger(JSON.stringify(e));

  }
};
export const close = () =>{
  socket?.disconnect();
  socket?.close();
}
export const sendRequest = () => {
  if (!socket) throw new Error("socket problem");

  const req = get(request);
  const reqJson = isJson(req.body) ? JSON.parse(req.body) : req;
  socket.on('message',()=>console.log('eee'))
  socket.emit(req.emitName, reqJson, (response: any, er:any) => {

    request.set({...req, response});
    
    const historyStore:RequestType[] = get(requestHistory);
    const objIndex = historyStore.findIndex(item => item.title == req.title);

    if (objIndex === -1) {
      historyStore.push(req);
      requestHistory.set(historyStore);
    } else {
      historyStore[objIndex] = req;
    }
    saveRequest();
  });

  socket.on("error", function() {
    console.log('eoooperpoepo')
  });
}

export const logger = (value:string) => {
  const _logs = get(logs);
  _logs.push({time: new Date().toISOString().slice(0, 19), message: value, id:nanoid(5)});
  logs.set(_logs);
}