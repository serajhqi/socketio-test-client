<script lang="ts">
  import "./lib/tailwind.css";
  import ToolBar from "./lib/components/ToolBar.svelte";
  import Request from "./lib/components/Request.svelte";
</script>

<main class="w-screen h-screen bg-stone-700">
    <ToolBar/>

    <div class="flex flex-col md:flex-row w-full">
      <div class="md:w-1/5 w-full">
        history
      </div>
      <div class="md:w-2/5 w-full h-full border-2 border-gray-400">
        <Request/>
      </div>
      <div class="md:w-2/5 w-full">
        response
      </div>
    </div>
</main>


<style>

  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  input.caret-bar > span {
  animation: blink 1s step-end infinite;
  border-left: 2px solid white;
}



</style>