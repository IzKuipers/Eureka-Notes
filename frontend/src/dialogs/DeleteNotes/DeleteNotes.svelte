<script lang="ts">
  import { onMount } from "svelte";
  import ProgressBar from "../../lib/ProgressBar.svelte";
  import type { DeleteNotesDialog } from "./DeleteNotes";

  const { dialog }: { dialog: DeleteNotesDialog } = $props();
  const { status, done } = dialog;

  onMount(() => {
    dialog.go();
  });
</script>

<div class="dialog-body">
  <h1>Deleting notes</h1>
  <p>{$status}</p>
  <ProgressBar max={dialog.total} value={$done} />
</div>
