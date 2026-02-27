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
  let serverAddress: string | null = null;
  let socketPath = "";
  let optionsText = "";
  let statusMessage = "";

  const normalizePath = (value: string | null | undefined) => {
    if (!value) return "";
    const trimmed = value.trim();
    if (!trimmed) return "";
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  };

  function handleSubmit() {
    if (optionsText && !isJson(optionsText)) {
      addNotification({
        text: "Socket.IO client options must be a valid JSON object",
        position: "bottom-center",
        type: "danger",
        removeAfter: 3000,
      });
      return;
    }

    const parsedOptions =
      optionsText && optionsText.trim() ? JSON.parse(optionsText) : {};
    if (
      parsedOptions &&
      (typeof parsedOptions !== "object" || Array.isArray(parsedOptions))
    ) {
      addNotification({
        text: "Socket.IO client options must be a JSON object",
        position: "bottom-center",
        type: "danger",
        removeAfter: 3000,
      });
      return;
    }

    const normalizedPath = normalizePath(socketPath);
    const mergedOptions = { ...parsedOptions };
    if (normalizedPath) {
      mergedOptions.path = normalizedPath;
    }

    $serverSettings.options = mergedOptions;
    $serverSettings.address = serverAddress;
    $serverSettings.path = normalizedPath;
    localStorage.setItem("address", serverAddress);
    localStorage.setItem("path", normalizedPath);
    localStorage.setItem("options", JSON.stringify(mergedOptions));
    socketPath = normalizedPath;
    settingsModal = false;
  }

  function clearSettings() {
    tabAsSpaces = true;
    serverAddress = null;
    socketPath = "";
    optionsText = "";
    serverSettings.set({
      address: null,
      path: "",
      status: "disconnected",
      options: {},
      id: undefined,
    });
    localStorage.removeItem("address");
    localStorage.removeItem("path");
    localStorage.removeItem("options");
    settingsModal = false;
  }

  function handleTextArea(e) {
    if (e.code == "Tab" && tabAsSpaces) {
      e.preventDefault();
      optionsText = optionsText + "    ";
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
    socketPath = normalizePath(localStorage.getItem("path"));
    const optionsFromStorage = localStorage.getItem("options");
    if (optionsFromStorage && isJson(optionsFromStorage)) {
      optionsText = JSON.stringify(JSON.parse(optionsFromStorage), null, 2);
    }
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
          on:invalid={() =>
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
          for="path"
          class="block mb-2 text-sm font-medium text-gray-300 text-left"
          >Socket.IO Path (optional)</label
        >
        <input
          type="text"
          name="path"
          id="path"
          bind:value={socketPath}
          placeholder="example: /my-custom-path (default: /socket.io/)"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-4 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
        <p class="text-xs text-gray-300 -mt-2 mb-3 text-left">
          This is the Socket.IO endpoint path configured on your server (not the full URL). If your server uses the default, leave this empty.
        </p>
        <label
          for="options"
          class="block mb-2 text-sm font-medium text-gray-300 text-left"
          >Socket.IO Client Options (JSON)</label
        >
        <textarea
          name="options"
          id="options"
          aria-labelledby="options tabuse"
          on:keydown={(e) => handleTextArea(e)}
          bind:value={optionsText}
          spellcheck="false"
          placeholder={`Example: {"extraHeaders":{"x-api-key":"123"},"auth":{"token":"abc"}}`}
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
          <li>Use <b>Socket.IO Path</b> for custom endpoints (example: <code>/ws/chat</code>). Leave empty to use default <code>/socket.io/</code>.</li>
          <li> Add <b>CORS</b> to server in case of connection error in development environment. <a target="_blank"rel="noreferrer" class="text-blue-500 underline" href="https://github.com/serajhqi/socketio-test-client/issues/10">issue#10</a></li>  
          <li><b>Advanced options</b> <a target="_blank"rel="noreferrer" class="text-blue-500 underline" href="https://socket.io/docs/v3/client-initialization/#extraheaders">Offical Guide</a>.  
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
