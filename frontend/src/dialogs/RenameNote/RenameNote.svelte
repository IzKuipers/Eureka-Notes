<script lang="ts">
  import { GlobalViewerState } from "../../ts/state/viewer";
  import type { RenameNoteDialog } from "./RenameNote";

  const { dialog }: { dialog: RenameNoteDialog } = $props();
  const { newName: saveName } = dialog;

  GlobalViewerState?.status.set(`Renaming note`);
</script>

<div class="dialog-body">
  <h1>Rename note</h1>
  <p>Choose a new name for this note:</p>
  <input type="text" bind:value={$saveName} placeholder={dialog.oldName} />
</div>
