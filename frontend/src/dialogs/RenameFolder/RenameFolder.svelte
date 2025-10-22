<script lang="ts">
  import { GlobalViewerState } from "../../ts/state/viewer";
  import type { RenameFolderDialog } from "./RenameFolder";

  const { dialog }: { dialog: RenameFolderDialog } = $props();
  const { newName: saveName } = dialog;

  GlobalViewerState?.status.set(`Renaming folder`);
</script>

<div class="dialog-body">
  <h1>Rename folder</h1>
  <p>Choose a new name for this folder:</p>
  <!-- svelte-ignore a11y_autofocus -->
  <input type="text" bind:value={$saveName} placeholder={dialog.oldName} autofocus/>
</div>
