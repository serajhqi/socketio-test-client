<script lang="ts">
  import { get } from "svelte/store";
  import { sendRequest } from "../scripts/socketioHandler";
  import { connectionStatus,request } from "../store";
  import ConnectionController from "./ConnectionController.svelte";
  import ServerAddressModal from "./ServerAddressModal.svelte";
  import { getNotificationsContext } from 'svelte-notifications';
  import {nanoid} from 'nanoid';
import type { RequestHistory } from "../scripts/storageHandler";

  const { addNotification } = getNotificationsContext();
  let sending = false;

  let _request:Partial<RequestHistory> = {
    title:null,
    emitName:null,
    body:null,
    response:null
  }

  request.subscribe((value) => {
    _request = value;
  });
  function setEmitName(e: Event){
    const value =  (e.target as HTMLTextAreaElement)?.value;
    value && request.set( {...get(request),emitName:value} );
  }
  function setTitle(e: Event){
    const value =  (e.target as HTMLTextAreaElement)?.value;
    value && request.set( {...get(request),title:value} );
  }
  function setBody(e: Event){
    const value =  (e.target as HTMLTextAreaElement)?.value;
    console.log(value)
    value && request.set( {...get(request), body:value} );
  }


  function requestHandler(){
    console.log('eee')
    if(get(connectionStatus)!=='connected'){
      addNotification({
            text: 'Sever is not conneted',
            position: 'bottom-center',
            type: 'danger',
        })
      return;
    }
    if(!_request.emitName || _request.emitName.length === 0){
      addNotification({
            text: 'Emit name is not set',
            position: 'bottom-center',
            type: 'danger',
        })
      return;
    }
    sending = true;
    console.log('sss')
    try{
      sendRequest({..._request, title: _request.title || nanoid(4)}, sending);
    }catch(e){
      addNotification({
            text: e,
            position: 'bottom-center',
            type: 'danger',
            description: e
        })
    }
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
        value={$request.emitName}
        class="w-full bg-transparent ml-2 outline-0 cursor-white caret-white text-amber-400"
        placeholder="Emit Name"
      />
      <input
        on:input={(e)=>setTitle(e)}
        value={$request.title}
        class="w-full bg-transparent ml-2 outline-0 cursor-white caret-white text-amber-400"
        placeholder="Optional Title"
      />
    </div>
    <div>
      <button
        on:click={requestHandler}
        class="h-full py-1 w-16 focus:bg-stone-500 text-gray-200 hover:bg-stone-600 hover:text-white rounded-sm"
        >Send</button
      >
    </div>
  </div>
  {JSON.stringify(_request)}
  <textarea
    on:input={(e)=>setBody(e)}
    value={_request.body}
    placeholder="Data to send"
    class="bg-transparent p-2 caret-white border-0 outline-0 h-200 text-amber-400"
  />
</div>
