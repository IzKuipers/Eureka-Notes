<script lang="ts">
  import type { RenameNoteDialog } from "./RenameNote";

  const { dialog }: { dialog: RenameNoteDialog } = $props();
  const { newName: saveName } = dialog;
</script>

<div class="dialog-body">
  <h1>Rename note</h1>
  <p>Choose a new name for this note:</p>
  <input type="text" bind:value={$saveName} />
</div>
