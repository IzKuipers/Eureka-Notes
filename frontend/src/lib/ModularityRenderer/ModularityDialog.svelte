<script lang="ts">
  import { ViewerState } from "../../ts/state/viewer";
  import type { ModularityDialogInstance } from "../../types/dialog";
  import DialogButton from "./ModularityDialog/DialogButton.svelte";

  const { key, dialog }: { key: string; dialog: ModularityDialogInstance } = $props();
  const { maxZIndex } = ViewerState!;
  const { visible } = dialog;
  const Component = dialog.component!;
</script>

<div class="modularity-dialog-wrapper wrapper-{dialog.className} flex-center fill-absolute" style="z-index: {$maxZIndex * 10};" class:visible={$visible}>
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
