import { io, Socket } from "socket.io-client";
import { serverAddress, connectionStatus , history} from "../store";
import { get } from "svelte/store";
import { saveRequest, removeRequest, RequestHistory } from "./storageHandler";

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
    let state = get(connectionStatus);
    let address = get(serverAddress);

    if (state == "disconnected" || state == "disconnecting") {
      connectionStatus.set("connecting");

      socket = io(address, { timeout: 5000 });
      socket.connect();
      socket.on("connect", () => connectionStatus.set("connected"));
      socket.on("disconnect", () => connectionStatus.set("disconnected"));
    } else if (state == "connected" || state == "connecting") {
      connectionStatus.set("disconnecting");

      socket?.disconnect();
      socket?.close();

      connectionStatus.set("disconnected");
      socket = null;
    }
  } catch (e) {}
};

export const sendRequest = (request:Partial<RequestHistory>, loading:boolean) => {
  if (!socket) throw new Error("socket problem");
  console.log('errr')
  const requestJson = isJson(request.body) ? JSON.parse(request.body) : request;
  loading = true;
  socket.emit(request.emitName, requestJson, (response: any) => {
    loading = false;
    const result = saveRequest({...request,response}) as RequestHistory;
    const historyStore = get(history);
    historyStore.push(result);
    history.set(historyStore);
  });
  socket.on("error", function() {
    console.log('eoooperpoepo')
});
}
