<script lang="ts">
  import { onMount } from "svelte";
  import FolderSelector from "../../lib/FolderSelector.svelte";
  import { MoveNotesDialog } from "./MoveNotes";
  import ProgressBar from "../../lib/ProgressBar.svelte";

  const { dialog }: { dialog: MoveNotesDialog } = $props();
  const { destinationFolder, status, done, folder } = dialog;
</script>

<div class="dialog-body">
  <h1>Move Notes</h1>
  {#if dialog.total === 1}
    <p>Choose where to move this note:</p>
  {:else}
    <p>Choose where to move these notes:</p>
  {/if}
  <FolderSelector bind:outFolderId={$destinationFolder} startFolderId={folder?.folderId || ""} />
  <p class="status">{$status}</p>
  {#if dialog.total > 1}
    <ProgressBar max={dialog.total} value={$done} />
  {/if}
</div>
