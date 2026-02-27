import { io, Socket } from "socket.io-client";
import { requestHistory, serverSettings, request, RequestType,logs, listeners } from "../store";
import { get } from "svelte/store";
import { saveRequest } from "./storage";
import { nanoid } from "nanoid";

export const isJson = (str: string) => {
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
    const {address,status,options} = get(serverSettings);

    if (status == "disconnected" ) {
      if (!address) {
        logger("connection error: server address is not set");
        return;
      }

      serverSettings.set({...server, status: 'connecting'})
      logger('connecting');

      socket = io(address, options);
      socket.connect();
      
      socket.on("connect", () => {
        serverSettings.set({...server, status: 'connected',id: socket.id});
        logger('connected');
      });
      socket.on('connect_error', error => {
        serverSettings.set({...server, status: 'disconnected', id:undefined})
        logger('connection error: ' + error.message);
        
        if(get(serverSettings).status !== 'connected'){
          socket.disconnect();
          logger('disconnected');
        }

      })
      socket.on("disconnect", () => {
        serverSettings.set({...server, status: 'disconnected', id:undefined})
        logger('disconnected');
      });
      function handleEvent(eventName: string, ...args: any[]) {
        const _listeners = get(listeners);
        let listener = _listeners.find(item => item.title == eventName);
        if(listener){
          const index = _listeners.findIndex(item => item.title == eventName);
          listener = {...listener, messages:[...listener.messages, {id: nanoid(5), time: new Date().toISOString().slice(11, 19), text: args}]};
          _listeners[index] = listener;
          listeners.set(_listeners);
        }
        logger(eventName + ' ' + args);
      }
      
      socket.onAny(handleEvent);
      socket.onAnyOutgoing(handleEvent);

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
  logger('[request] ' + req.emitName + ' ' + JSON.stringify(reqJson))
  const startTime = Date.now();
  socket.emit(req.emitName, reqJson, (response: any, er:any) => {
    const duration = Date.now() - startTime;
    request.set({...req, response, duration});
    
    const historyStore:RequestType[] = get(requestHistory);
    const objIndex = historyStore.findIndex(item => item.title == req.title);

    if (objIndex === -1) {
      historyStore.push(req);
      requestHistory.set(historyStore);
    } else {
      historyStore[objIndex] = req;
      logger('[response] ' + req.emitName + ' ' + JSON.stringify(response))
    }
    saveRequest();
  });

  socket.on("error", function(e) {
    logger(JSON.stringify(e))
  });
}

export const logger = (value:string) => {
  const _logs = get(logs);
  _logs.push({time: new Date().toISOString().slice(0, 19), message: value, id:nanoid(5)});
  logs.set(_logs);
}
