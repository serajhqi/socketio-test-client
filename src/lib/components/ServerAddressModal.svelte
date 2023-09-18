<script lang="ts">
  import { onMount } from "svelte";
  import { isJson } from "../handlers/socketio";
  import { serverSettings } from "../store";
  import Modal from "./Modal.svelte";
  import { getNotificationsContext } from "svelte-notifications";
  const { addNotification } = getNotificationsContext();

  let tabAsSpaces = true;
  let modalTitleId = "settingsModal";
  let settingsModal = false;
  let serverAddress = null;
  let headers = null;
  let statusMessage = "";

  function handleSubmit() {
    if (headers && isJson(headers)) {
      $serverSettings.options = JSON.parse(headers);
    } else if (headers == null) {
      $serverSettings.options = {};
    } else {
      addNotification({
        text: "Headers must be json object",
        position: "bottom-center",
        type: "danger",
        removeAfter: 3000,
      });
      return;
    }
    $serverSettings.address = serverAddress;
    localStorage.setItem("address", serverAddress);
    settingsModal = false;
  }

  function clearSettings() {
    tabAsSpaces = true;
    serverAddress = null;
    headers = null;
    serverSettings.set({
      address: null,
      status: "disconnected",
      options: {},
      id: undefined,
    });
    localStorage.removeItem("address");
    settingsModal = false;
  }

  function handleTextArea(e) {
    if (e.code == "Tab" && tabAsSpaces) {
      e.preventDefault();
      headers = headers + "    ";
    } else if (e.code == "KeyM" && e.ctrlKey) {
      e.preventDefault();
      tabAsSpaces = !tabAsSpaces;

      statusMessage = tabAsSpaces
        ? "Pressing Tab will now insert the tab character."
        : "Pressing Tab will now move focus to the next focusable element.";
      setTimeout(() => {
        statusMessage = "";
      }, 200);
    }
  }
  onMount(() => {
    serverAddress = localStorage.getItem("address");
  });
</script>

<div role="status" aria-live="polite" class="sr-only">{statusMessage}</div>
<button
  class="pr-2 w-full text-center text-clip overflow-hidden"
  on:click={() => (settingsModal = !settingsModal)}
>
  <span class="sr-only">{serverAddress ? "Current URL: " + serverAddress : "Set URL"}</span>
  <span aria-hidden="true">{serverAddress || "Set URL"}</span>
</button>

<Modal
  visible={settingsModal}
  {modalTitleId}
  on:onClose={() => (settingsModal = false)}
>
  <div>
    <h3 class="mb-4 text-xl font-medium text-white">
      Socket.IO Server Settings
    </h3>
    <form
      class="space-y-6 mb-2"
      action="#"
      on:submit|preventDefault={handleSubmit}
    >
      <div>
        <label
          for="address"
          class="block mb-2 text-sm font-medium text-gray-300 text-left"
          >Socket.IO Server Address *
        </label
        > 

        <input
          type="text"
          name="address"
          id="address"
          pattern="(http|https|ws|wss):\/\/(.)*"
          bind:value={serverAddress}
          oninvalid={() =>
            "this.setCustomValidity('URL should start with one of the http|https|ws|wss:// ')"}
          placeholder="example: http://localhost:3000"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          required
        />
        
      </div>
      <div>
        <p id="tabuse" class="sr-only">
          , If you press ctrl +m you can switch between inserting spaces or the
          normal use of tab
        </p>
        <label
          for="headers"
          class="block mb-2 text-sm font-medium text-gray-300 text-left"
          >Custom Headers Object</label
        >
        <textarea
          name="headers"
          id="headers"
          aria-labelledby="headers tabuse"
          on:keydown={(e) => handleTextArea(e)}
          bind:value={headers}
          spellcheck="false"
          placeholder="Headers must be a JSON object"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
      <div class="text-sm text-left mt-1">
        <div class="text-white flex flex-row">
          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#ff5" stroke-width="1.5"/>
            <circle cx="12" cy="12" r="4" stroke="#ff5" stroke-width="1.5"/>
            <path d="M15 9L19 5" stroke="#ff5" stroke-width="1.5"/>
            <path d="M5 19L9 15" stroke="#ff5" stroke-width="1.5"/>
            <path d="M9 9L5 5" stroke="#ff5" stroke-width="1.5"/>
            <path d="M19 19L15 15" stroke="#ff5" stroke-width="1.5"/>
          </svg>
          <div class="ml-1">Help:</div>
        </div>
        
        <ul class="ml-6">
          <li> Add <b>CORS</b> to server in case of connection error in development environment. <a target="_blank"rel="noreferrer" class="text-blue-500 underline" href="https://github.com/serajhqi/socketio-test-client/issues/10">issue#10</a></li>  
          <li><b>Custom header</b> <a target="_blank"rel="noreferrer" class="text-blue-500 underline" href="https://socket.io/docs/v3/client-initialization/#extraheaders">Offical Guide</a>.  
          Exmaple: <a target="_blank"rel="noreferrer" class="text-blue-500 underline" href="https://github.com/serajhqi/socketio-test-client/issues/15">issue#15</a></li>
        </ul>
      </div> 

      <div
        class="flex items-center rounded-b pt-4 border-gray-200 dark:border-gray-600"
      >
        <input
          type="submit"
          value="Set"
          data-modal-toggle="extralarge-modal"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        />
        <button
          on:click={clearSettings}
          data-modal-toggle="extralarge-modal"
          type="button"
          class="ml-1 text-gray-500 focus:ring-4 focus:outline-none rounded-lg text-sm font-medium px-5 py-2.5 hover:text-blue-400 focus:z-10"
        >
          Unset
        </button>
      </div>
    </form>
  </div>
</Modal>
