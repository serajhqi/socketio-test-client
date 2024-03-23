<script lang="ts">
  import { each, onMount } from "svelte/internal";
  import Modal from "./Modal.svelte";

  let visible = false;
  let modalTitleId = "helpModal";

  let contributers = []
  
  onMount(()=>{
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        contributers = JSON.parse(this.responseText) || [];
    };
    xhttp.open(
      "GET",
      "https://api.github.com/repos/serajhqi/socketio-test-client/contributors"
    );
    xhttp.send();
  })
</script>

<button
  class="pr-2 w-full text-center text-clip overflow-hidden"
  on:click={() => (visible = !visible)}
  aria-label="Access to help"
>
 <svg style="fill: gray" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1.25 17c0 .69-.559 1.25-1.25 1.25-.689 0-1.25-.56-1.25-1.25s.561-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25zm1.393-9.998c-.608-.616-1.515-.955-2.551-.955-2.18 0-3.59 1.55-3.59 3.95h2.011c0-1.486.829-2.013 1.538-2.013.634 0 1.307.421 1.364 1.226.062.847-.39 1.277-.962 1.821-1.412 1.343-1.438 1.993-1.432 3.468h2.005c-.013-.664.03-1.203.935-2.178.677-.73 1.519-1.638 1.536-3.022.011-.924-.284-1.719-.854-2.297z"/></svg>
</button>

<Modal {visible} {modalTitleId} on:onClose={() => (visible = false)}>  
<div>
    <h2 id={modalTitleId} class="mb-4 text-xl font-medium text-white">
      Socket.IO Test Client Extension Help
    </h2>

    <div class="container text-white max-h-80 overflow-y-auto scrollbar">
        <p class="text-bold text-xl">The page has 5 Sections</p>
        <div class="my-2">
            <h3 class="text-bold text-xl">Request Settings</h3>
            <div class="text-gray-300 p-1">
                <p>
                    In the middle part of the screen you see the request settings:
                </p>
                <ol class="pl-10 text-sm text-yellow-100">
                    <li> The Socket.IO server address (required)</li>
                    <li> You can also <b>custom headers</b> including authentication credentials in server settings modal (optional)</li>
                    <li> The Emit name (required)</li>
                    <li> The title you specify here will be used for the title of saved history of the sent requests. If you don't specify one the extension generates a random one for you.</li>
                    <li> The body is the content you want to send to sever</li>
                </ol>
            </div>
        </div>
        <div>
            <h3 class="text-bold text-xl">Requests History</h3>
            <div class="text-gray-300 p-1">
                <p>
                    On the left you see the requests that have been sent to server. It has some features:
                </p>
                <ol class="pl-10 text-sm text-yellow-100">
                    <li> Search the requests by their title </li>
                    <li> Open button just opens the recorded request containing emit name, title, request body and response</li>
                    <li> The title you specify here will be used for the title of saved history of the sent requests. If you don't specify one the extension generates a random one for you.</li>
                    <li> The body is the content you want to send to sever</li>
                </ol>
            </div>
        </div>
        <div>
            <h3 class="text-bold text-xl">Connection Logs</h3>
            <div class="text-gray-300 p-1">
                <p>
                    On the middle bottom part of the screen you can follow the logs of the connection.
                </p>
                <ul class="pl-10 text-sm text-yellow-100">
                    <li> By clicking on each log it will be highlighted for better tracking </li>
                    <li> Request and Response log has 4 parts: [time] [type] [emit name] message </li>
                    <li> Event log has 3 parts: [time] [event name] message </li>
                </ul>
            </div>
        </div>
        <div>
            <h3 class="text-bold text-xl">Request Response</h3>
            <div class="text-gray-300 p-1">
                <p>
                    On the right top part of the screen you can check the response of acknowledged requests.
                </p>
                <ul class="pl-10 text-sm text-yellow-100">
                    <li> If the response is JSON then it will be interactive </li>
                </ul>
            </div>
        </div>
        <div>
            <h3 class="text-bold text-xl">Defined Listeners</h3>
            <div class="text-gray-300 p-1">
                <p>
                    On the right bottom part of the screen you can define your specific listeners.
                </p>
                <ol class="pl-10 text-sm text-yellow-100">
                    <li> The left column is the list of defined listeners </li>
                    <li> The middle column is the comming messages for that specific listener </li>
                    <li> The right column is the details of the specific message </li>
                </ol>
            </div>
        </div>
        <div>
            <h3 class="text-bold text-xl">Additional Features</h3>
            <div class="text-gray-300 p-1">
                <p>Thanks to <a target="_blank"rel="noreferrer" class="text-blue-500 underline" href="https://github.com/gFrincu">Georgiana Frincu</a>'s contribution</p>
                <ol class="pl-10 text-sm text-yellow-100">
                    <li> By pressing <b>Cntl + M</b> you can switch between inserting Tabs and Navigation. </li>
                    <li> Screen reader is added to application. </li>
                </ol>
            </div>
        </div>
        <div>
            <h2 class="text-bold text-xl">Contributers</h2>
            <div class="text-gray-300 p-1">
                <div class="flex gap-2 flex-wrap w-50">
                    {#if Array.isArray(contributers)}
                        {#each contributers || [] as contributer}
                            <a class="flex gap-2 items-center" href={contributer.html_url} target="_blank">
                                <img src={contributer.avatar_url} class="rounded" width="20px" alt={`${contributer.login} avatar`}/>
                                <div class="hover:text-blue-500">
                                    {contributer.login}
                                </div>
                            </a>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>

        <div>
            <h2 class="text-bold text-xl">Github</h2>
            <div class="text-gray-300 p-1">
                <p>
                    Star <a target="_blank"rel="noreferrer" class="text-blue-500 underline" href="https://github.com/serajhqi/socketio-test-client">this repo</a> on github if you found this extension useful.
                </p>
                
            </div>
        </div>
    </div>

    <div
      class="flex items-center rounded-b  pt-4 border-gray-200 dark:border-gray-600"
    >
      <button
        on:click={() => (visible = false)}
        data-modal-toggle="extralarge-modal"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >OK</button
      >
    </div>
  </div>
</Modal>
