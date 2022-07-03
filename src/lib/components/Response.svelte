<script lang="ts">
  import JSONTree from "svelte-json-tree";
  import { request ,serverSettings} from "../store";
</script>

<div class="flex flex-col w-full h-full">
  <div class="flex flex-row border-b border-burning items-center ">
    <div
      class="flex justify-between items-center px-2 py-2 h-10 text-center text-semiburnt border-b border-burning w-full shadow-b-lg"
    >
      <div>Server Response</div>
      <div class="text-semiburnt text-xs">id: <span class="ml-2 text-gray-300">{$serverSettings.id || 'diconnected'}</span></div>
    </div>
  </div>
  <div class="p-4">
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
