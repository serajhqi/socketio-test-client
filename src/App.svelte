<script lang="ts">
  import "./lib/tailwind.css";
  import ToolBar from "./lib/components/ToolBar.svelte";
</script>

<main class="w-full">
    <ToolBar/>

    <div class="flex flex-col md:flex-row w-full bg-blue-100">
      <div>history</div>
      <div>request</div>
      <div>response</div>
    </div>
</main>


<style>

  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }





</style>
