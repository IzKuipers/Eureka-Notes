<script lang="ts">
  import { GlobalViewerState } from "../../ts/state/viewer";
  import type { NewFolderDialog } from "./NewFolder";

  const { dialog }: { dialog: NewFolderDialog } = $props();
  const { saveName, loading } = dialog;

  async function onkeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      $loading = true;
      await dialog.save();
      $loading = false;
    }
  }
</script>

<div class="dialog-body">
  <h1>New folder</h1>
  <p>Choose a name for your new folder:</p>
  <!-- svelte-ignore a11y_autofocus -->
  <input type="text" bind:value={$saveName} autofocus {onkeydown} />
</div>
