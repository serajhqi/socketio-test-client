<script lang="ts">
  import { sendRequest } from "../handlers/socketio";
  import { serverSettings, request } from "../store";
  import ConnectionController from "./ConnectionController.svelte";
  import ServerAddressModal from "./ServerAddressModal.svelte";
  import { getNotificationsContext } from "svelte-notifications";
  import { nanoid } from "nanoid";
  const { addNotification } = getNotificationsContext();

  let tabAsSpaces = true;
  let statusMessage = "";

  function requestHandler() {
    if ($serverSettings.status !== "connected") {
      addNotification({
        text: "Server is not connected",
        position: "bottom-center",
        type: "danger",
        removeAfter: 3000,
      });
      return;
    }
    if (!$request.emitName || $request.emitName.length === 0) {
      addNotification({
        text: "Emit name is not set",
        position: "bottom-center",
        type: "danger",
        removeAfter: 3000,
      });
      return;
    }

    try {
      if (!$request.title) $request.title = nanoid(4);
      sendRequest();
    } catch (e) {
      addNotification({
        text: e,
        position: "bottom-center",
        type: "danger",
        description: e,
        removeAfter: 3000,
      });
    }
  }

  function handleTextArea(e) {
    if (e.code == "Tab" && tabAsSpaces) {
      e.preventDefault();
      $request.body = $request.body + "    ";
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
</script>

<div role="status" aria-live="polite" class="sr-only">{statusMessage}</div>
<div class="flex flex-col w-full h-full">
  <div class="flex flex-row border-b-2 border-burning items-cente">
    <div
      class="flex px-2 py-1 h-10 w-40 text-center text-sm text-semiburnt border-r-2 border-burning"
    >
      <ServerAddressModal />
    </div>
    <div class="items-center px-2">
      <ConnectionController />
    </div>
    <div class="w-full flex flex-row">
      <input
        bind:value={$request.emitName}
        class="w-full bg-transparent ml-2 border-r border-burning outline-0 cursor-white caret-white text-amber-400"
        placeholder="Emit Name"
      />
      <input
        bind:value={$request.title}
        class="w-full bg-transparent ml-2 outline-0 cursor-white caret-white text-amber-400"
        placeholder="Optional Title"
      />
    </div>
    <div>
      <button
        on:click={requestHandler}
        class="h-full py-1 px-2 focus:bg-stone-500 text-gray-200 hover:bg-stone-600 hover:text-white rounded-sm"
        aria-label="Request"
      >
        <svg
          class=""
          width="24"
          style="fill: orange"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M85.333333 896 981.333333 512 85.333333 128 85.333333 426.666667 725.333333 512 85.333333 597.333333 85.333333 896Z"
          /></svg
        >
      </button>
    </div>
  </div>
  <textarea
    on:keydown={(e) => handleTextArea(e)}
    bind:value={$request.body}
    spellcheck="false"
    placeholder="Data to send"
    class="bg-transparent p-2 caret-white border-0 outline-0 h-200 text-amber-400 h-full scrollbar"
  />
</div>
