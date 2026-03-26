<script lang="ts">
  import { onMount } from "svelte";
  import type { DialogButton, ModularDialog } from "../../../types/dialog";

  let { button, key, dialog }: { button: DialogButton; key: string; dialog: ModularDialog } = $props();
  let element = $state<HTMLButtonElement>();

  const { loading } = dialog;

  async function execute() {
    $loading = true;
    await button.action?.();
    $loading = false;
  }

  onMount(() => {
    if (button.autofocus) element?.focus();
  });
</script>

<button bind:this={element} class={button.className} disabled={$loading} onclick={execute}>{button.caption}</button>
