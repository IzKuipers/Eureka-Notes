<script lang="ts">
    import { onMount } from "svelte";
    import { DisposeDialog } from "../../../ts/dialog";
    import type { DialogButton } from "../../../types/dialog";

  let { button, key, loading = $bindable() }: { button: DialogButton; key: string; loading: boolean } = $props();

  let element = $state<HTMLButtonElement>();

  async function execute() {
    loading = true;
    await button.action?.();
    DisposeDialog(key);
  }

  onMount(() => {
    if (button.autofocus) element?.focus();
  })
</script>

<button bind:this={element} class={button.className} disabled={loading} onclick={execute}>{button.caption}</button>
