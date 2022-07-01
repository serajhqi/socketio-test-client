<script lang="ts">
    import JSONTree from 'svelte-json-tree';
    import type {RequestHistory} from '../scripts/storageHandler';
    import { onMount } from 'svelte';
    import { request } from '../store';

    let value:RequestHistory|{} = {};
    
    request.subscribe(req=>{
        value = req.response
    })
    onMount(()=>{
        value={}
    })
</script>

<div >
    <JSONTree {value} />
</div>