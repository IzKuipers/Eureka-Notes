<script lang="ts">
  import ProgressBar from "../../lib/ProgressBar.svelte";
  import type { ImportNotesDialog } from "./ImportNotes";

  const { dialog }: { dialog: ImportNotesDialog } = $props();
  const { Working, Total, Done, Status } = dialog;
</script>

<div class="dialog-body">
  <h1>Import notes</h1>
  <p class="info">
    You are about to import text documents into Eureka. The idea here is that you'll import existing notes from your devices here,
    and remove them on your devices so that they're all in one place.
  </p>
  {#if !$Working}
    <p>To continue, click <b>Begin import</b>.</p>
  {:else}
    <p class="status">{$Status}</p>
    <ProgressBar max={$Total} value={$Done} />
  {/if}
</div>
