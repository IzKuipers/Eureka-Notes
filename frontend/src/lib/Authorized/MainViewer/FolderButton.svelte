<script lang="ts">
  import { FolderIcon } from "../../../ts/images";
  import { GlobalViewerState } from "../../../ts/state/viewer";
  import type { ExistingEurekaFolder } from "../../../types/folder";

  const { folder }: { folder: ExistingEurekaFolder } = $props();

  async function navigate() {
    await GlobalViewerState?.navigate(`${GlobalViewerState.path()}/${folder.name}`);
  }
</script>

<button class="viewer-item" ondblclick={navigate}>
  <img src={FolderIcon} alt="" />
  <span>{folder.name}</span>
</button>
