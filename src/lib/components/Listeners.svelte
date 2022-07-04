<script lang="ts">
  import { listeners } from "../store";
  import JSONTree from "svelte-json-tree";
  import { saveListeners } from "../scripts/storageHandler";
  import { onDestroy, onMount } from "svelte";

  let listener = null;
  let selectedListenerId: string;
  let selectedMessageId: string;

  function addListener(e) {
    if (!e.target?.value || e.code != "Enter") return;
    if (e.code == "Enter") {
      if ($listeners.find((item) => item.title == e.target.value)) {
        return;
      } else {
        $listeners = [
          ...$listeners,
          {
            title: e.target.value,
            messages: [],
          },
        ];
        listener = "";
        saveListeners();
      }
    }
  }

  function removeListener(listener: { title: string }) {
    $listeners = $listeners.filter((item) => item.title !== listener.title);
    saveListeners();
  }

  function removeListenerMessages(listenerId: string) {
    const index = $listeners.findIndex((item) => item.title == listenerId);
    $listeners[index] = { title: listenerId, messages: [] };
  }

</script>

<div class="flex flex-col w-full h-full overflow-hidden">
  <div class="inlin-block w-full h-10 py-1 px-2 bg-burnt text-semiburnt">
    <input
      placeholder="Add listener"
      class="bg-transparent outline-none w-full"
      bind:value={listener}
      on:keydown={(e) => addListener(e)}
    />
  </div>

  <div class="flex flex-row w-full h-full">
    <div
      class="w-1/5 flex flex-col h-[calc(100%-3.5rem)] bg-burnt items-center overflow-y-auto scrollbar"
    >
      <div class="container">
        {#each [...$listeners].reverse() as listener}
          <div
            class="flex flex-row justify-between px-2 w-full border-b border-gray-700 cursor-pointer"
            on:click={() => (selectedListenerId = listener.title)}
          >
            <div
              class="text-semiburnt hover:text-gray-300 {selectedListenerId ==
              listener.title
                ? 'text-gray-300'
                : ''}"
            >
              {listener.title}
            </div>
            <button
              class="text-semiburnt hover:text-red-500"
              on:click={() => removeListener(listener)}
            >
              <svg
                class="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                /></svg
              >
            </button>
          </div>
        {/each}
      </div>
    </div>

    <div
      class="w-1/5 flex flex-col h-[calc(100%-3.5rem)] bg-stone-700 overflow-y-auto scrollbar"
    >
      <div
        class="flex justify-end p-1 text-gray-500 text-xs hover:text-red-300"
      >
        {#if $listeners.find((item) => item.title == selectedListenerId)?.messages?.length > 0}
          <button
            class="outline-none"
            on:click={() => removeListenerMessages(selectedListenerId)}
            >Clear</button
          >
        {/if}
      </div>

      <div class="block container">
        {#each [...($listeners.find((item) => item.title == selectedListenerId)?.messages || [])].reverse() as message}
          <div
            class="border-b border-semiburnt text-semiburnt text-xs cursor-pointer px-1 {message.id ===
            selectedMessageId
              ? 'text-gray-300'
              : ''}"
            on:click={() => (selectedMessageId = message.id)}
            style="font-size=10px"
          >
            {message.time}
          </div>
        {/each}
      </div>
    </div>

    <div class="w-3/5 h-full bg-stone-600 p-2 overflow-y-auto scrollbar">
      <span class="text-white"
        >{($listeners
          .find((listener) => listener.title == selectedListenerId)
          ?.messages.find((msg) => msg.id == selectedMessageId)?.time) ||
          ''}</span
      >
      {#if selectedMessageId}
        <JSONTree
          value={$listeners
            .find((listener) => listener.title == selectedListenerId)
            ?.messages.find((msg) => msg.id == selectedMessageId)?.text}
          --json-tree-property-color="#a6e22e"
          --json-tree-string-color="#f25a00"
          --json-tree-symbol-color="#66d9ef"
          --json-tree-boolean-color="#c594c5"
          --json-tree-function-color="#c594c5"
          --json-tree-number-color="#f99157"
          --json-tree-label-color="#f92672"
          --json-tree-arrow-color="#ae81ff"
          --json-tree-null-color="#66d9ef"
          --json-tree-undefined-color="#66d9ef"
          --json-tree-date-color="#fd971f"
          --json-tree-operator-color="#f8f8f2"
          --json-tree-regex-color="#9effff"
          --json-tree-li-identation="2em"
          --json-tree-li-line-height="1.5"
          --json-tree-font-size="16px"
          --json-tree-font-family="monospace"
          defaultExpandedLevel={100}
        />
      {/if}
    </div>
  </div>
</div>
