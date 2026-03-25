<script lang="ts">
  import { onMount } from "svelte";
  import type { DialogOptions } from "../../types/dialog";
  import DialogButton from "./MessageDialog/DialogButton.svelte";

  const { key, dialog }: { key: string; dialog: DialogOptions } = $props();

  let loading = $state<boolean>(false);
  let visible = $state<boolean>(false);

  onMount(() => setTimeout(() => (visible = true)));
</script>

<div class="message-dialog-wrapper flex-center fill-absolute" class:visible>
  <div class="dialog message-dialog">
    <div class="dialog-body">
      <div class="left">
        <span class="lucide icon-{dialog.icon}"></span>
      </div>
      <div class="right">
        <h1>{dialog.title}</h1>
        <p>{dialog.message}</p>
      </div>
    </div>
    <div class="dialog-actions">
      {#each dialog.buttons as button}
        <DialogButton {button} {key} bind:loading bind:visible />
      {/each}
    </div>
  </div>
</div>
