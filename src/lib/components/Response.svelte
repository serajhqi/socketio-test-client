<script lang="ts">
  import JSONTree from "svelte-json-tree";
  import { request ,serverSettings} from "../store";
</script>

<div class="flex flex-col w-full h-full z-1">
  <div class="flex flex-row border-b border-burning items-center ">
    <div
      class="flex justify-between items-center px-2 py-2 h-10 text-center text-semiburnt border-b border-burning w-full shadow-b-lg"
    >
      <div>
        Connection id: <span class="ml-2 text-yellow-300 text-sm">{$serverSettings.id || 'disconnected'}</span>
      </div>
      <div class="text-sm flex flex-row justify-between w-30">
        <div class="text-semiburnt">Duration: </div>
        <div class="text-yellow-300 w-20">{$request.duration && $request.duration + "ms" || "0"}</div></div>
    </div>
  </div>
  <div class="p-4 flex flex-col overflow-y-auto scrollbar">
    {#if $request.response }
      <JSONTree
      value={$request.response}
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
