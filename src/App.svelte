<script lang="ts">
  import "./lib/tailwind.css";
  import ToolBar from "./lib/components/TopMenu.svelte";
  import Request from "./lib/components/Request.svelte";
  import Response from "./lib/components/Response.svelte";
  import History from "./lib/components/History.svelte";
  import { onMount } from "svelte";
  import {
    serverSettings,
    requestHistory,
    listeners,
    RequestType,
    ListenerType,
    repoStars
  } from "./lib/store";
  import Notifications, { getNotificationsContext } from "svelte-notifications";
  import { readItems } from "./lib/handlers/storage";
  import Logger from "./lib/components/Logger.svelte";
  import Listeners from "./lib/components/Listeners.svelte";
  import packageJson from "../package.json";
  // const { addNotification } = getNotificationsContext();

  let showHistory = true;

  function getRepoStars() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      $repoStars = JSON.parse(this.responseText).stargazers_count || 0;
    };
    xhttp.open(
      "GET",
      "https://api.github.com/repos/serajhqi/socketio-test-client"
    );
    xhttp.send();
  }

  


  onMount(() => {
    $serverSettings.address = localStorage.getItem("address") || null;
    const historyFromStorage = readItems<RequestType>("history");
    const listenersFromStorage = readItems<ListenerType>("listeners");
    historyFromStorage && requestHistory.set(historyFromStorage);
    listenersFromStorage && listeners.set(listenersFromStorage);
    getRepoStars();
  });
</script>

<Notifications>
  <main class="flex flex-col h-screen overflow-hidden bg-burnt">
    <ToolBar />
    <div class="flex h-full flex-row">
      {#if showHistory}
        <div
          class="block overflow-y-auto w-2/12 h-full pb-12 md:pb-0 scrollbar border-t-2 border-burning"
        >
          <History on:collpaseClicked={() => (showHistory = false)} />
        </div>
      {:else}
        <div class="block border-t-2 border-burning w-6 text-center ">
          <button class="mt-3" aria-label="Show Search box" on:click={() => (showHistory = true)}>
            <svg
              class="w-5 h-4"
              style="fill: gray"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              fill-rule="evenodd"
              clip-rule="evenodd"
              ><path
                d="M0 23h24v-22h-24v22zm2-20h14v18h-14v-18zm4 4l6 5-6 5v-10z"
              /></svg
            >
          </button>
        </div>
      {/if}

      <div
        class="border-r-2 border-l-2 border-burning mb:border-b-0 border-t-2 mb:border-t-0 flex flex-col w-5/12 content-between"
      >
        <div class="flex h-3/5">
          <Request />
        </div>
        <div
          class="flex flex-col h-2/5 w-full md:pb-0 border-t-2 border-burning"
        >
          <Logger />
        </div>
      </div>
      <div
        class="border-r-2 border-l-2 border-burning mb:border-b-0 border-t-2 mb:border-t-0 flex flex-col {showHistory
          ? 'w-5/12'
          : 'w-7/12'} content-between"
      >
        <div class="flex h-3/5">
          <Response />
        </div>
        <div
          class="flex h-2/5 w-full overflow-y-auto md:pb-0 scrollbar border-t-2 border-burning"
        >
          <Listeners />
        </div>
      </div>
    </div>
  </main>
</Notifications>

<style global>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
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
