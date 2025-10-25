<script lang="ts">
  import { GlobalViewerState } from "../../ts/state/viewer";
  import type { ModularityDialogInstance } from "../../types/dialog";
  import DialogButton from "./ModularityDialog/DialogButton.svelte";

  const { key, dialog }: { key: string; dialog: ModularityDialogInstance } = $props();
  const { maxZIndex } = GlobalViewerState!;
  const Component = dialog.component!;
</script>

<div class="modularity-dialog-wrapper flex-center fill-absolute" style="z-index: {$maxZIndex * 10};">
  <div class="dialog modularity-dialog {dialog.className}" id={key}>
    <Component {dialog} />
    {#if dialog.buttons?.length}
      <div class="dialog-actions">
        {#each dialog.buttons as button}
          <DialogButton {button} {key} {dialog} />
        {/each}
      </div>
    {/if}
  </div>
</div>
