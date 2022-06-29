
import { io, Socket } from "socket.io-client";
import { serverAddress, connectionStatus } from '../store';
import { get } from 'svelte/store';

let socket: Socket | null = null;
export const toggleConnection =  async() => {
    try{
        let state = get(connectionStatus);
        let address = get(serverAddress);

        if(state == 'disconnected' || state == 'disconnecting'){
          connectionStatus.set('connecting')
          socket = io(address);
          socket.connect();
          
          socket.on('connect', () => {
            console.log('5')
            connectionStatus.set('connected')
          });

          socket.on('disconnect', () => {
            console.log('6')
            connectionStatus.set('disconnected')
          });
         
        }else if(state== 'connected' || state == 'connecting'){     

          connectionStatus.set('disconnecting')
          socket?.disconnect()
          socket?.close();
          connectionStatus.set('disconnected');
          socket = null;

        }
        
        
    }catch(e){
      console.log('4')

        console.log(e)
    }
}

