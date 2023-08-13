<script>
    import { onMount, onDestroy } from "svelte";

    export let visible = false;
    export let modalTitleId;
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let modalElement;

    function closeEventHandler() {
        visible = false;
        dispatch("onClose");
    }

    function handleKeydown(event) {
        if (event.key === "Escape") {
            closeEventHandler();
        }

        // Focus Trap
        const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusableModalElements = Array.from(focusableElements).filter(
            (element) => element instanceof HTMLElement
        );
        const firstElement = focusableModalElements[0];
        const lastElement =
            focusableModalElements.pop();

        if (
            event.key === "Tab" &&
            event.shiftKey &&
            document.activeElement === firstElement
        ) {
            lastElement.focus();
            event.preventDefault();
        } else if (
            event.key === "Tab" &&
            !event.shiftKey &&
            document.activeElement === lastElement
        ) {
            firstElement.focus();
            event.preventDefault();
        }
    }

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    });

    $: if (visible && modalElement) {
        focusFirstElement();
    }

    function focusFirstElement() {
        const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusableModalElements = Array.from(focusableElements).filter(
            (element) => element instanceof HTMLElement
        );
        const firstElement = focusableModalElements[0];
        if (firstElement) {
            firstElement.focus();
        }
    }
</script>

{#if visible}
    <div
        bind:this={modalElement}
        class="fixed top-0 left-0 w-screen h-screen z-10"
        aria-modal="true"
        role="alertdialog"
        aria-labelledby={modalTitleId}
    >
        <div class="absolute bg-black w-screen h-screen opacity-40" />
        <div
            class="absolute w-screen h-screen flex items-center justify-center"
        >
            <div
                class="relative w-1/2 bg-burning rounded-lg shadow dark:bg-gray-700 min-w-200"
            >
                <button
                    on:click={closeEventHandler}
                    type="button"
                    class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                    data-modal-toggle="authentication-modal"
                    aria-label="Close modal"
                >
                    <svg
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        ><path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        /></svg
                    >
                </button>
                <div class="py-6 px-6 lg:px-8">
                    <slot />
                </div>
            </div>
        </div>
    </div>
{/if}
