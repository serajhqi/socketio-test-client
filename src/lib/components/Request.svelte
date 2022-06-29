<script lang="ts">
  import { get } from "svelte/store";
  import { sendRequest } from "../scripts/socketioHandler";
  import { eventName, connectionStatus } from "../store";
  import ConnectionController from "./ConnectionController.svelte";
  import ServerAddressModal from "./ServerAddressModal.svelte";
  import { getNotificationsContext } from 'svelte-notifications';
  import {nanoid} from 'nanoid';

  const { addNotification } = getNotificationsContext();

  let emitName = null;
  let title = null;
  let requestBody = null;
  let sending = false;

  eventName.subscribe((value) => {
    emitName = value;
  });
  
  function setEmitName(e: Event){
    const value =  (e.target as HTMLTextAreaElement)?.value;
    value && eventName.set( value );
  }

  function request(){
    if(get(connectionStatus)!=='connected'){
      addNotification({
            text: 'Sever is not conneted',
            position: 'bottom-center',
            heading: 'hi i am custom notification',
            type: 'danger',
            description: 'lorem ipsum'
        })
      return;
    }
    if(!emitName || emitName.length === 0){
      addNotification({
            text: 'Emit name is not set',
            position: 'bottom-center',
            heading: 'hi i am custom notification',
            type: 'danger',
            description: 'lorem ipsum'
        })
      return;
    }
    sending = true;
    sendRequest(requestBody,emitName,title || nanoid(4), sending);
  }
</script>

<div class="w-full flex flex-col">
  <div class="flex flex-row border-b-2 border-gray-400 items-center ">
    <div class="px-2 py-1 w-40 text-center text-sm text-white border-r-2 border-gray-400">
      <ServerAddressModal/>
    </div>
    <div class="items-center px-2">
      <ConnectionController/>
    </div>
    <div class="w-full flex flex-row">
      <input
        on:input={ e => setEmitName(e)}
        class="w-full bg-transparent ml-2 outline-0 cursor-white caret-white text-amber-400"
        placeholder="Emit Name"
      />
      <input
        bind:value={title}
        class="w-full bg-transparent ml-2 outline-0 cursor-white caret-white text-amber-400"
        placeholder="Optional Title"
      />
    </div>
    <div>
      <button
        on:click={request}
        class="h-full py-1 w-16 focus:bg-stone-500 text-gray-200 hover:bg-stone-600 hover:text-white rounded-sm"
        >Send</button
      >
    </div>
  </div>
  <textarea
    bind:value={requestBody}
    placeholder="Data to send"
    class="bg-transparent p-2 caret-white border-0 outline-0 h-200 text-amber-400"
  />
</div>
