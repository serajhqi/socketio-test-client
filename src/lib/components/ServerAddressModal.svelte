<script lang="ts">
  import { onMount } from "svelte";
  import { serverAddress } from "../store";
  import Modal from "./Modal.svelte";

  let settingsModal = false;
  let socketioAddress = null;

  function handleSubmit(e) {
    const { address } = Object.fromEntries(new FormData(e.target));

    socketioAddress = address;
    serverAddress.set(address as string);

    localStorage.setItem("socketio.address", address as string);
    settingsModal = false;
  }

  function clearAddress() {
    socketioAddress = null;
    localStorage.removeItem("socketio.address");
  }

  onMount(() => {
    socketioAddress = localStorage.getItem("socketio.address");
  });
</script>

 <button class="pr-2" on:click={() => (settingsModal = !settingsModal)}>
    { socketioAddress ||'Set Addr'}
</button>

<Modal visible={settingsModal} on:onClose={() => (settingsModal = false)}>
  <div>
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Socket.IO Server Settings
    </h3>
    <form
      class="space-y-6 mb-2"
      action="#"
      on:submit|preventDefault={handleSubmit}
    >
      <div>
        <label
          for="password"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Socket.IO Server Address</label
        >
        <input
          type="text"
          name="address"
          value={socketioAddress}
          pattern="(http|https):\/\/(.)*"
          oninvalid={()=>"this.setCustomValidity('URL should start with http:// or https://')"}
          placeholder="example: http://localhost:3000"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          required
        />
      </div>
      <div
        class="flex items-center rounded-b border-t pt-4 border-gray-200 dark:border-gray-600"
      >
        <input
          type="submit"
          value="Set"
          data-modal-toggle="extralarge-modal"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        />
        <button
          on:click={clearAddress}
          data-modal-toggle="extralarge-modal"
          type="button"
          class="ml-1 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
        >
          Unset
        </button>
      </div>
    </form>
  </div>
</Modal>
