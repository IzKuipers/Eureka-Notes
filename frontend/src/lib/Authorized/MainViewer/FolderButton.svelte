<script lang="ts">
  import { FolderIcon } from "../../../ts/images";
  import { contextMenu } from "../../../ts/state/context";
  import { GlobalViewerState } from "../../../ts/state/viewer";
  import { SEP_ITEM } from "../../../types/context";
  import type { ExistingEurekaFolder } from "../../../types/folder";

  const { folder }: { folder: ExistingEurekaFolder } = $props();

  async function navigate() {
    await GlobalViewerState?.navigate(`${GlobalViewerState.path()}/${folder.name}`);
  }
</script>

<button
  class="viewer-item"
  ondblclick={navigate}
  use:contextMenu={[
    {
      caption: "Open",
      action: () => navigate(),
    },
    SEP_ITEM,
    {
      caption: "Rename...",
      action: () => GlobalViewerState?.renameFolder(folder),
    },
    {
      caption: "Move...",
      action: () => GlobalViewerState?.moveFolder(folder),
    },
    SEP_ITEM,
    {
      caption: "Delete...",
      action: () => GlobalViewerState?.deleteFolder(folder),
    },
  ]}
>
  <img src={FolderIcon} alt="" />
  <span>{folder.name}</span>
</button>
