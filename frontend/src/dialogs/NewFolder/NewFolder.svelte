<script lang="ts">
  import { GlobalViewerState } from "../../ts/state/viewer";
  import type { NewFolderDialog } from "./NewFolder";

  const { dialog }: { dialog: NewFolderDialog } = $props();
  const { saveName } = dialog;

  GlobalViewerState?.status.set("Creating a new folder");
</script>

<div class="dialog-body">
  <h1>New folder</h1>
  <p>Choose a name for your new folder:</p>
  <input type="text" bind:value={$saveName} />
</div>
