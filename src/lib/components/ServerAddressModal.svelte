<script lang="ts">
  import { onMount } from "svelte";
  import { isJson } from "../handlers/socketio";
  import { serverSettings } from "../store";
  import Modal from "./Modal.svelte";
  import { getNotificationsContext } from "svelte-notifications";
  const { addNotification } = getNotificationsContext();

  let settingsModal = false;
  let modalTitleId = "modalTitleId";
  let serverAddress = null;
  let headers = null;

  function handleSubmit() {
    if (headers && isJson(headers)) {
      $serverSettings.options = JSON.parse(headers);
    } else if (headers == null) {
      $serverSettings.options = {};
    } else {
      addNotification({
        text: "Headers must be a json object",
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


  onMount(() => {
    serverAddress = localStorage.getItem("address");
  });

  function handleInvalid(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.setCustomValidity(
      "URL should start with one of the http|https|ws|wss://"
    );
  }
</script>

<button
  class="pr-2 w-full text-center text-clip overflow-hidden"
  on:click={() => (settingsModal = !settingsModal)}
>
  {serverAddress || "Set URL"}
</button>
<Modal
  visible={settingsModal}
  {modalTitleId}
  on:onClose={() => (settingsModal = false)}
>
  <div>
    <h3 id={modalTitleId} class="mb-4 text-xl font-medium text-white">
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
          >Socket.IO Server Address *</label
        >
        <input
          type="text"
          name="address"
          id="address"
          pattern="(http|https|ws|wss):\/\/(.)*"
          bind:value={serverAddress}
          on:invalid={handleInvalid}
          placeholder="example: http://localhost:3000"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          required
        />
      </div>
      <div>
        <label
          for="headers"
          class="block mb-2 text-sm font-medium text-gray-300 text-left"
          >Custom Headers Object</label
        >
        <textarea
        id="headers"
          name="headers"
          bind:value={headers}
          spellcheck="false"
          placeholder="Headers must be a JSON object"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        />
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
