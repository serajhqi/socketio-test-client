<script lang="ts">
  import { listeners } from "../store";
  import JSONTree from "svelte-json-tree";
  import { saveListeners } from "../handlers/storage";
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
  <div class="inlin-block w-full h-10 py-1 px-2 bg-burnt text-semiburnt flex flex-row">
    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none">
      <path d="M8.3931 9.85868C8.38638 10.2728 8.71667 10.614 9.13083 10.6208C9.54499 10.6275 9.88618 10.2972 9.8929 9.88303L8.3931 9.85868ZM12 7.10386L11.9882 7.85376C11.9961 7.85389 12.0039 7.85389 12.0118 7.85376L12 7.10386ZM14.857 9.87086L15.607 9.87398C15.607 9.86888 15.607 9.86378 15.6069 9.85868L14.857 9.87086ZM13.633 12.1419L14.043 12.7699L14.048 12.7666L13.633 12.1419ZM11.1306 14.0509C10.7297 14.1549 10.489 14.5643 10.593 14.9652C10.6971 15.3662 11.1064 15.6069 11.5074 15.5028L11.1306 14.0509ZM7 10.0039H7.75L7.75 10.0034L7 10.0039ZM10.9911 5.10335L11.1424 5.83793L10.9911 5.10335ZM16.5941 8.0272L15.905 8.32319V8.32319L16.5941 8.0272ZM14.857 14.1039L15.2755 14.7264L15.2856 14.7194L14.857 14.1039ZM10.808 18.8589L11.0019 19.5834L10.808 18.8589ZM7 16.6609H6.25C6.25 16.7169 6.25628 16.7728 6.26873 16.8274L7 16.6609ZM9.8929 9.88303C9.91139 8.74418 10.8493 7.8358 11.9882 7.85376L12.0118 6.35395C10.0449 6.32292 8.42502 7.89179 8.3931 9.85868L9.8929 9.88303ZM12.0118 7.85376C13.1507 7.8358 14.0886 8.74418 14.1071 9.88303L15.6069 9.85868C15.575 7.89179 13.9551 6.32292 11.9882 6.35395L12.0118 7.85376ZM14.107 9.86773C14.1042 10.5314 13.7708 11.1499 13.218 11.5171L14.048 12.7666C15.0174 12.1227 15.6021 11.0378 15.607 9.87398L14.107 9.86773ZM13.223 11.5139C12.1865 12.1906 11.7688 12.9152 11.4957 13.4681C11.1952 14.0765 11.2 14.0329 11.1306 14.0509L11.5074 15.5028C12.386 15.2748 12.6633 14.4913 12.8406 14.1324C13.0452 13.718 13.3105 13.2481 14.043 12.7699L13.223 11.5139ZM7.75 10.0034C7.74865 7.98563 9.16618 6.24508 11.1424 5.83793L10.8397 4.36878C8.16601 4.91964 6.24817 7.2745 6.25 10.0044L7.75 10.0034ZM11.1424 5.83793C13.1186 5.43077 15.1087 6.46926 15.905 8.32319L17.2833 7.7312C16.2059 5.22293 13.5134 3.81793 10.8397 4.36878L11.1424 5.83793ZM15.905 8.32319C16.7013 10.1771 16.0843 12.3354 14.4285 13.4884L15.2856 14.7194C17.5259 13.1595 18.3606 10.2395 17.2833 7.7312L15.905 8.32319ZM14.4386 13.4814C12.7369 14.6254 12.0653 15.8324 11.6155 16.7728C11.3827 17.2595 11.2593 17.5528 11.0926 17.7881C10.9604 17.9747 10.8318 18.0761 10.6141 18.1344L11.0019 19.5834C11.6137 19.4196 12.0184 19.0761 12.3166 18.6551C12.5803 18.2829 12.7841 17.8059 12.9687 17.4199C13.3537 16.6149 13.8771 15.6663 15.2754 14.7263L14.4386 13.4814ZM10.6141 18.1344C9.89164 18.3277 9.26349 18.3009 8.7965 18.0746C8.35861 17.8623 7.94128 17.4162 7.73127 16.4943L6.26873 16.8274C6.55872 18.1005 7.21589 18.9754 8.14225 19.4244C9.03951 19.8593 10.0654 19.834 11.0019 19.5834L10.6141 18.1344ZM7.75 16.6609V10.0039H6.25V16.6609H7.75Z" fill="#ff5"/>
    </svg>
    <input
      placeholder="Add listener"
      class="bg-transparent outline-none w-full focus:text-gray-300 text-lg"
      spellcheck="false"
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
        <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
        <div
        class="flex flex-row justify-between px-2 w-full border-b border-gray-700 cursor-pointer"
        on:click={() => (selectedListenerId = listener.title)}
       
        >
         <!-- tabindex = "0":: make the div focusable -->
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
      class="w-1/5 flex flex-col h-[calc(100%)-3.5rem] bg-stone-700 overflow-y-auto scrollbar"
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

      <div class="block container pb-24">
        {#each [...($listeners.find((item) => item.title == selectedListenerId)?.messages || [])].reverse() as message}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <p
            class="border-b border-semiburnt font-bold text-xs cursor-pointer px-1 {message.id ===
            selectedMessageId
              ? 'text-gray-300'
              : 'text-semiburnt'}"
            on:click={() => (selectedMessageId = message.id)}
            style="font-size=10px"
          >
            {message.time}{message.id}
          </p>
        {/each}
      </div>
    </div>

    <div class="w-3/5 h-full bg-stone-600 p-2 overflow-y-auto scrollbar pb-28">
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
          --json-tree-string-color="#f8f8f2"
          --json-tree-symbol-color="#f99157"
          --json-tree-boolean-color="#9cd1a1"
          --json-tree-function-color="#9cd1a1"
          --json-tree-number-color="#f99157"
          --json-tree-label-color="#a6e22e"
          --json-tree-arrow-color="#f99157"
          --json-tree-null-color="#f99157"
          --json-tree-undefined-color="#f99157"
          --json-tree-date-color="#f8f8f2"
          --json-tree-operator-color="#f8f8f2"
          --json-tree-regex-color="#9cd1a1"
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
