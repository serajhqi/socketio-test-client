<script lang="ts">
import { onDestroy } from "svelte";
import { logs, LogType } from "../store";
let selectedId = '';
function clearLogs(){
    logs.set([]);
}
function selectLog(value:LogType){
    selectedId = value.id;
}
const unsubscribe = logs.subscribe(items => {
    if(items.length > 2000) clearLogs();
})
onDestroy(()=>unsubscribe())
</script>

<div class="relative flex-col h-full bg-black w-full content-between">
    <div
      class="sticky top-0 h-10 flex flex-row bg-burning justify-between items-center px-2 py-2 text-center text-semiburnt border-b border-burning w-full shadow-b-lg"
    >
      <div>Logs</div>
      <button class="hover:text-gray-300" on:click={clearLogs}>Clear</button>
    </div>
    <div class="flex flex-col h-full text-green-500 overflow-y-auto pb-28 scrollbar">
        {#each [...$logs].reverse() as log, index}
        <p class=" break-words {selectedId == log.id?'text-black bg-white':''}" on:click={()=>selectLog(log)}>>>>
            <span class="text-xs mr-2">[{log.time}]</span>
            {log.message}
        </p>
        {/each}
    </div>
</div>