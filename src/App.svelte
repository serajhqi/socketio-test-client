<script lang="ts">
  import "./lib/tailwind.css";
  import ToolBar from "./lib/components/TopMenu.svelte";
  import Request from "./lib/components/Request.svelte";
  import Response from "./lib/components/Response.svelte";
  import History from "./lib/components/History.svelte";
  import { onMount } from "svelte";
  import { serverSettings, requestHistory, listeners, RequestType, ListenerType } from "./lib/store";
  import Notifications from 'svelte-notifications';
  import { readItems} from "./lib/handlers/storage";
  import Logger from "./lib/components/Logger.svelte";
  import Listeners from "./lib/components/Listeners.svelte";

  let showHistory = true;
  onMount(()=>{
    $serverSettings.address = localStorage.getItem('address') || null;
    const historyFromStorage = readItems<RequestType>('history');
    const listenersFromStorage = readItems<ListenerType>('listeners');
    historyFromStorage && requestHistory.set(historyFromStorage);
    listenersFromStorage && listeners.set(listenersFromStorage);
  })
</script>

<Notifications>
  <main class="flex flex-col h-screen overflow-hidden bg-burnt">
      <ToolBar/>
      <div class="flex h-full flex-row">
        {#if showHistory}
        <div class="block overflow-y-auto w-2/12 h-full pb-12 md:pb-0 scrollbar border-t-2 border-burning" >
          <History on:collpaseClicked={()=> (showHistory = false)}/>
        </div>
        {:else}
        <div class="block border-t-2 border-burning w-6 text-center " >
          <button class="mt-3" on:click={()=>(showHistory = true)}>
            <svg style="fill: gray" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"/></svg>           
          </button>
        </div>
        {/if}
        
        <div class="border-r-2 border-l-2 border-burning mb:border-b-0 border-t-2 mb:border-t-0 flex flex-col w-5/12 content-between">
          <div class="flex h-3/5">
            <Request/>
          </div>
          <div class="flex flex-col h-2/5 w-full md:pb-0 border-t-2 border-burning" >
            <Logger/>
          </div>
        </div>
        <div class="border-r-2 border-l-2 border-burning mb:border-b-0 border-t-2 mb:border-t-0 flex flex-col w-5/12 content-between">
          <div class="flex h-3/5">
            <Response/>
          </div>
          <div class="flex h-2/5 w-full overflow-y-auto md:pb-0 scrollbar border-t-2 border-burning" >
            <Listeners/>
          </div>
        </div>
      </div>
  </main>
</Notifications>

<style global>

  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  input.caret-bar > span {
    animation: blink 1s step-end infinite;
    border-left: 2px solid white;
  }

 .scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 3px;
  }

  .scrollbar::-webkit-scrollbar-track {
      border-radius: 100vh;
      background: black;
  }

  .scrollbar::-webkit-scrollbar-thumb {
      background: #e0cbcb;
      border-radius: 100vh;
      border: 3px solid lightgray;
  }

  .scrollbar::-webkit-scrollbar-thumb:hover {
      background: #c0a0b9;
  }
</style>
