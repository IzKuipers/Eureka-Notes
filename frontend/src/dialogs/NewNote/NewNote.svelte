<script lang="ts">
  import type { NewNoteDialog } from "./NewNote";

  const { dialog }: { dialog: NewNoteDialog } = $props();
  const { saveName } = dialog;
</script>

<div class="dialog-body">
  <h1>New note</h1>
  <p>Choose a name for your new note:</p>
  <input type="text" bind:value={$saveName} />
</div>
