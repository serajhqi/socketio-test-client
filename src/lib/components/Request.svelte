<script lang="ts">
  import { serverAddress, eventName, serverActive } from "../store";

  let address = null;
  let event = null;
  serverAddress.subscribe((value) => {
    address = value;
  });
  eventName.subscribe((value) => {
    event = value;
  });
  
  function setEventName(e: Event){
    const value =  (e.target as HTMLTextAreaElement)?.value;
    value && eventName.set( value );
  }
</script>

<div class="w-full flex flex-col">
  <div class="flex flex-row border-b-2 border-gray-400 items-center ">
    <div class="px-2 py-1 text-white border-r-2 border-gray-400">
      {address || "server"}
    </div>
    <div class="w-full">
      <input
        on:input={ e => setEventName(e)}
        class="w-full bg-transparent ml-2 outline-0 cursor-white caret-white text-amber-400"
        placeholder="Event Name"
      />
    </div>
    <div>
      <button
        class="h-full py-1 w-16 focus:bg-stone-500 text-gray-200 hover:bg-stone-600 hover:text-white rounded-sm"
        >Send</button
      >
    </div>
  </div>
  <textarea
    placeholder="Data to send"
    class="bg-transparent p-2 caret-white border-0 outline-0 h-200 text-amber-400"
  />
</div>
