<script lang="ts">
  import { onMount } from "svelte";
import { serverAddress } from "../store";
  import Modal from "./Modal.svelte";

  let settingsModal = false;
  let socketioAddress = null;

  function handleSubmit(e){
    const { address } = Object.fromEntries(new FormData(e.target));

    socketioAddress = address;
    serverAddress.set(address);

    localStorage.setItem('socketio.address', address as string);
    settingsModal = false;
  }
  function clearAddress(){
      socketioAddress = null;
    localStorage.removeItem('socketio.address');
  }
  onMount(()=>{
    socketioAddress = localStorage.getItem('socketio.address');
  })
</script>


<div class="flex flex-row items-center justify-between py-2">
  <h1 class="font-bold text-2xl px-4 text-white">Socket.IO API Devtool</h1>
  <div class="flex flex-row px-4">
    <button class="pr-2" on:click={() => (settingsModal = !settingsModal)}
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        ><path
          d="M19 2c1.654 0 3 1.346 3 3v14c0 1.654-1.346 3-3 3h-14c-1.654 0-3-1.346-3-3v-14c0-1.654 1.346-3 3-3h14zm5 3c0-2.761-2.238-5-5-5h-14c-2.762 0-5 2.239-5 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5v-14zm-8 5c.552 0 1 .449 1 1s-.448 1-1 1-1-.449-1-1 .448-1 1-1zm0-2c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm-8 2c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm8-4c.343 0 .677.035 1 .101v-1.101c0-.552-.447-1-1-1s-1 .448-1 1v1.101c.323-.066.657-.101 1-.101zm-8 2c.343 0 .677.035 1 .101v-3.101c0-.552-.447-1-1-1s-1 .448-1 1v3.101c.323-.066.657-.101 1-.101zm8 8c-.343 0-.677-.035-1-.101v3.101c0 .552.447 1 1 1s1-.448 1-1v-3.101c-.323.066-.657.101-1 .101zm-8 2c-.343 0-.677-.035-1-.101v1.101c0 .552.447 1 1 1s1-.448 1-1v-1.101c-.323.066-.657.101-1 .101z"
        /></svg
      ></button
    >
    <a href="https://github.com/serajhqi/socketio-test-client" target="_blank">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        ><path
          d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
        /></svg
      >
    </a>
  </div>
</div>

<Modal visible={settingsModal} on:onClose={() => (settingsModal = false)}>
  <div>
    <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
      Socket.IO Server Settings
    </h3>
    <form class="space-y-6 mb-2" action="#" on:submit|preventDefault={handleSubmit}>
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
          oninvalid="this.setCustomValidity('URL should start with http:// or https://')"
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
          </button
        >
      </div>
    </form>
  </div>
</Modal>