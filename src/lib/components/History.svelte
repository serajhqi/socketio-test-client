<script lang="ts">
import { get } from "svelte/store";

    import { RequestHistory, removeRequest } from "../scripts/storageHandler";

    import { history, request } from "../store";
    let historyList: RequestHistory[];

    history.subscribe((items)=>{
        historyList = items;
    });
    function onRemove(key:string){
        removeRequest(key);
        const historyStore: RequestHistory[] = get(history);
        history.set(historyStore.filter(item => item.key !== key));
    }
    function onOpen(item:RequestHistory){
        request.set(item)
    }
</script>

<div>
    {#each historyList.reverse() as item}
        <div class="flex flex-row justify-between items-center h-14 p-2 border-t-2 border-gray-400">
            <div class="flex flex-row items-center text-sm">
                <div>
                    <svg style="fill: white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 24l3-9h-9l14-15-3 9h9l-14 15z"/></svg>
                </div>
                <div class="ml-2 text-white font-bold">
                    {item.title}
                </div>
            </div>
            <div class="flex flex-row items-center text-sm">
                <button on:click={()=>onOpen(item)} class="text-blue-400">open</button>
                <button on:click={()=>onRemove(item.key)} class="ml-2 text-red-400">remove</button>
            </div>
        </div>
    {/each}
</div>