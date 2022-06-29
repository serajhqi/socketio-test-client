<script lang="ts">
  import { toggleConnection } from "../scripts/socketioHandler";
  import { connectionStatus, serverAddress } from "../store";
  import { get } from "svelte/store";
  import { getNotificationsContext } from 'svelte-notifications';
  const { addNotification } = getNotificationsContext();

  let status = "disconnected";
  connectionStatus.subscribe(value => status = value);

  function toggler() {
    if(!get(serverAddress)) {
        addNotification({
            text: 'Please Set the server address first',
            position: 'bottom-center',
            heading: 'hi i am custom notification',
            type: 'danger',
            description: 'lorem ipsum'
        })
        return;
    }
    toggleConnection();
  }
</script>

<button class="outline-none w-10 mr-3 h-8 flex items-center justify-start" on:click={toggler}>
  {#if status == "connected"}
  <span><svg
      style="fill: yellow"
      width="36px"
      height="36px"
      viewBox="0 0 36 36"
      version="1.1"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <path
        d="M17,12H14.15a6.25,6.25,0,0,0-6.21,5H2v2H7.93a6.22,6.22,0,0,0,6.22,5H17Z"
        class="clr-i-solid clr-i-solid-path-1"
      /><path
        style="fill: yellow"
        d="M28.23,17A6.25,6.25,0,0,0,22,12H19V24h3a6.22,6.22,0,0,0,6.22-5H34V17Z"
        class="clr-i-solid clr-i-solid-path-2"
      />
      <rect x="0" y="0" width="36" height="36" fill-opacity="0" />
    </svg></span>
  {:else if status == "connecting" || status == "disconnecting"}
    <span class="text-white text-sm">Loading...</span>
  {:else if status == "disconnected"}
  <span><svg
      width="36px"
      height="36px"
      viewBox="0 0 36 36"
      version="1.1"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <path
        style="fill: white"
        d="M34,17H28.23A6.25,6.25,0,0,0,22,12H14.15a6.25,6.25,0,0,0-6.21,5H2v2H7.93a6.22,6.22,0,0,0,6.22,5H22a6.22,6.22,0,0,0,6.22-5H34ZM17.08,22H14.15a4.17,4.17,0,0,1-4.31-4,4.17,4.17,0,0,1,4.31-4h2.94ZM22,22H19V14h3a4.17,4.17,0,0,1,4.31,4A4.17,4.17,0,0,1,22,22Z"
        class="clr-i-outline clr-i-outline-path-1"
      />
      <rect x="0" y="0" width="36" height="36" fill-opacity="0" />
    </svg></span>
  {/if}
</button>
