<script lang="ts">
import HelpModal from "./HelpModal.svelte";
import pjson from "../../../package.json";
import { onMount } from "svelte";
import { getNotificationsContext } from 'svelte-notifications';
const { addNotification } = getNotificationsContext();

let starCount = 0;

function getRepoStars()
{
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    starCount = JSON.parse(this.responseText).stargazers_count || 0;
  }
  xhttp.open("GET", "https://api.github.com/repos/serajhqi/socketio-test-client");
  xhttp.send();
}

function checkVersion()
{
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    let tag_name = JSON.parse(this.responseText).tag_name;
    if(tag_name.replace("v", "") !== pjson.version){
      addNotification({
            text: 'Version ' + tag_name + ' is now available :)',
            position: 'top-right',
            type: 'success',
            removeAfter: 3000,
        })
    }
  }
  xhttp.open("GET", "https://api.github.com/repos/serajhqi/socketio-test-client/releases/latest");
  xhttp.send();
}

onMount(()=>{
  getRepoStars();
  checkVersion();
})
</script>


<div class="flex flex-row items-center justify-between border-b border-burning py-3">
 <div class="flex flox-row items-center px-2">
  <svg width="34" height="34" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet"><path d="M96.447 7.382c32.267-8.275 67.929-3.453 96.386 14.11 35.84 21.433 59.238 61.976 59.833 103.71 1.31 42.15-20.659 83.944-55.963 106.865-39.293 26.433-93.648 27.446-133.775 2.322-40.9-24.41-64.774-73.645-58.641-120.916 4.94-49.95 43.52-94.005 92.16-106.09z" fill="#010101"/><path d="M91.505 27.803c60.964-24.41 135.74 20.658 142.05 86.028 9.824 58.82-38.995 118.593-98.59 120.32-56.677 5.656-111.449-42.39-113.056-99.304-4.227-46.08 26.136-91.803 69.596-107.044z" fill="#FFF"/><path d="M97.637 121.69c27.327-22.326 54.058-45.426 81.98-67.097-14.646 22.505-29.708 44.711-44.354 67.215-12.562.06-25.123.06-37.626-.119zM120.737 134.132c12.621 0 25.183 0 37.745.179-27.505 22.206-54.117 45.484-82.099 67.096 14.646-22.505 29.708-44.77 44.354-67.275z" fill="#010101"/></svg>
  <h1 class="font-bold text-2xl px-4 text-semiburnt"><span class="text-blue-300">Socket.IO</span> Test Client <span class="text-sm">(v{pjson.version})</span></h1>
 </div>
  <div class="flex flex-row justify-between px-4 ml-5 items-center">
    <HelpModal/>
    <a href="https://github.com/serajhqi/socketio-test-client" target="_blank" rel="noreferrer" class="flex flex-row items-center text-white text-xs rounded font-bold h-6 bg-semiburnt items-center">
      <div class="bg-stone-600 h-full flex items-center p-1 rounded-l">
          <svg
          style="fill:white"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          ><path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
          </svg>
      </div>
      <div class="flex whitespace-nowrap items-center justity-center p-1 hover:text-blue-200">
        <span class="mx-1 text-sm">{starCount}</span> 
        <svg style="fill:white" width="15" height="15" viewBox="0 0 24 24"><path d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/></svg>
      </div>
    </a>
    
  </div>
  
</div>