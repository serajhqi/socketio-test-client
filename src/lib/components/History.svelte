<script lang="ts">
import { createEventDispatcher } from "svelte";

    import { removeRequest } from "../scripts/storageHandler";
    import { requestHistory, request, RequestType, requestInFocus } from "../store";
    const dispatch = createEventDispatcher();
    let search = '';
    $: filteredList = $requestHistory.filter(item => item.title.startsWith(search))

    function onRemove(title:string){
        removeRequest(title);
        $requestHistory = $requestHistory.filter(item => item.title !== title);
    }

    function onOpen(item:RequestType){
        request.set(item)
    }
    function collapse(){
        dispatch('collpaseClicked');
    }
    
</script>

<div class="min-w-500">
    <div class="flex flex-row justify-between px-2 py-2 h-10 text-left text-sm text-semiburnt border-b border-burning w-full shadow-b-lg">
        <input placeholder="Search" class="bg-transparent outline-none focus:text-white focus:placeholder-gray-300" bind:value={search}/>
        <button on:click={collapse}>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg> 
        </button>
    </div>
    <!-- without cloning it reverses the array -->
    {#each [...filteredList].reverse() as item}
        <div class="flex flex-row justify-between items-center h-14 p-2  border-stone-500 {$requestInFocus == item.title?'bg-burning':''} hover:bg-burning">
            <div class="flex flex-row items-center text-sm">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path style="fill: {$requestInFocus == item.title?'white':'gray'}" d="M12 0c-4.971 0-9 4.03-9 9s4.029 9 9 9 9-4.03 9-9-4.029-9-9-9zm4.298 15.137c-.079-.395-.177-.784-.299-1.166.673-.608.646-1.648-.054-2.162.436-1.739.458-3.636-.002-5.465.139-.083.261-.191.355-.319 1.101.309 2.124.8 3.04 1.434.105.497.162 1.012.162 1.541 0 2.537-1.269 4.779-3.202 6.137zm-11.798-6.137c0-.642.09-1.261.242-1.856.523-.033 1.044-.03 1.61.024l.03.169c-.691.581-1.312 1.246-1.864 2.005l-.018-.342zm2.387-.893c.636.482 1.562.327 1.997-.368 2.174.795 4.004 2.308 5.205 4.25-.575.581-.567 1.498.014 2.021-.511.923-1.161 1.758-1.919 2.48-3.678.087-6.693-2.446-7.477-5.773.578-.986 1.315-1.869 2.18-2.61zm2.165-1.425c1.493-.73 3.116-1.074 4.743-1.033.229.458.697.807 1.249.875h.005c.417 1.618.437 3.354.021 5.025l-.167.017c-1.294-2.119-3.325-3.849-5.823-4.726l-.028-.158zm4.546 9.643c.527-.613.983-1.271 1.36-1.971l.203-.006c.129.421.229.854.306 1.297-.582.305-1.209.536-1.869.68zm5.328-10.199c-.758-.42-1.557-.752-2.393-.983-.081-.746-.78-1.368-1.589-1.362-.415-.764-.924-1.481-1.517-2.141 2.49.482 4.546 2.197 5.499 4.486zm-4.855-2.031c-.192.165-.333.386-.393.644-1.842-.022-3.585.395-5.137 1.174-.637-.479-1.551-.316-1.982.361-.547-.056-1.036-.068-1.518-.053 1.106-2.763 3.806-4.721 6.959-4.721h.001c.822.745 1.525 1.62 2.07 2.595zm-6.071 19.905v-2h3v-2h2v2h3v2h-10zm9-2v2h3v-2h-3zm-10 0h-3v2h3v-2z"/></svg>                </div>
                <div class="ml-2 flex flex-col {$requestInFocus == item.title?'text-white':'text-semiburnt'}">
                  <span>{item.title}</span><span class="text-xs {$requestInFocus == item.title?'text-lime-500':'text-semiburnt'}">{item.emitName}</span>
                </div>
            </div>
            <div class="flex flex-row items-center text-sm">
                <button on:click={()=>onOpen(item)} class="text-blue-300 pr-2 border-r border-burning hover:text-blue-500">Open</button>
                <button on:click={()=>onRemove(item.title)} class="ml-2 text-red-400 hover:text-red-500">Remove</button>
            </div>
        </div>
    {/each}
</div>

<style>



</style>