<script lang="ts">
  import type { ModularityDialogInstance } from "../../types/dialog";
  import DialogButton from "./ModularityDialog/DialogButton.svelte";

  const { key, dialog }: { key: string; dialog: ModularityDialogInstance } = $props();

  const Component = dialog.component!;

  let loading = $state<boolean>(false);
</script>

<div class="modularity-dialog-wrapper flex-center fill-absolute">
  <div class="dialog modularity-dialog {dialog.className}">
    <Component {dialog} />
    {#if dialog.buttons?.length}
      <div class="dialog-actions">
        {#each dialog.buttons as button}
          <DialogButton {button} {key} bind:loading />
        {/each}
      </div>
    {/if}
  </div>
</div>
