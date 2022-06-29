<script lang="ts">
    import JSONTree from 'svelte-json-tree';
    import {history} from '../store';
    import type {RequestHistory} from '../scripts/storageHandler';
    import { onMount } from 'svelte';

    let value:RequestHistory|{} = {};
    history.subscribe(async(items)=>{
        value = items && items.length > 0 && (items[items.length -1])?.response
    })
    onMount(()=>{
        value={}
    })
</script>

<div >
    <JSONTree {value} />
</div>