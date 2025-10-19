<script lang="ts">
  import FolderSelector from "../../lib/FolderSelector.svelte";
  import { MoveFolderDialog } from "./MoveFolder";

  const { dialog }: { dialog: MoveFolderDialog } = $props();
  const { destinationFolder, folder: startFolder } = dialog;
</script>

<div class="dialog-body">
  <h1>Move Folder</h1>
  <p>Choose where to move '{startFolder.name}':</p>
  <FolderSelector bind:outFolderId={$destinationFolder} startFolderId={startFolder.parentId || ""} />
</div>
