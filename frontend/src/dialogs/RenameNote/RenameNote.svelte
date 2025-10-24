<script lang="ts">
  import { GlobalViewerState } from "../../ts/state/viewer";
  import type { RenameNoteDialog } from "./RenameNote";

  const { dialog }: { dialog: RenameNoteDialog } = $props();
  const { newName: saveName } = dialog;
</script>

<div class="dialog-body">
  <h1>Rename note</h1>
  <p>Choose a new name for this note:</p>
  <!-- svelte-ignore a11y_autofocus -->
  <input type="text" bind:value={$saveName} placeholder={dialog.oldName} autofocus />
</div>
