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

<div class="flex flex-col h-full bg-black w-full max-w-screen content-between">
    <div
      class="flex flex-row bg-burning justify-between items-center px-2 py-2 text-center text-semiburnt border-b border-burning w-full shadow-b-lg"
    >
      <div>Logs</div>
      <button class="hover:text-gray-300" on:click={clearLogs}>Clear</button>
    </div>

    <div id="logContainer" class="block text-green-500 w-full overflow-auto whitespace-nowrap container scrollbar">
        {#each [...$logs].reverse() as log, index}
             <div class="flex items-center text-ellipsis cursor-pointer overflow-hidden {index == 0 || selectedId == log.id?'text-white':''}" on:click={()=>selectLog(log)}>>
                <span class="text-xs mr-2">[{log.time}]</span>
                {log.message}</div>
        {/each}
    </div>
</div>