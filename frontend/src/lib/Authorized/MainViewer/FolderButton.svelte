<script lang="ts">
  import { FolderIcon } from "../../../ts/images";
  import { contextMenu } from "../../../ts/state/context";
    import { ViewerState } from "../../../ts/state/viewer";
  import { SEP_ITEM } from "../../../types/context";
  import type { ExistingEurekaFolder } from "../../../types/folder";

  const { folder }: { folder: ExistingEurekaFolder } = $props();

  async function navigate() {
    await ViewerState.navigate(`${ViewerState.path()}/${folder.name}`);
  }
</script>

<button
  class="viewer-item"
  class:concealed={folder.conceiled}
  ondblclick={navigate}
  use:contextMenu={[
    {
      caption: "Open",
      action: () => navigate(),
    },
    SEP_ITEM,
    {
      caption: "Rename...",
      action: () => ViewerState?.renameFolder(folder),
    },
    {
      caption: "Move...",
      action: () => ViewerState.moveFolder(folder),
    },
    SEP_ITEM,
    {
      caption: "Delete...",
      action: () => ViewerState.deleteFolder(folder),
    },
    {
      caption: "Conceal just this folder",
      action: () => ViewerState.toggleConcealedFolder(folder),
      active: () => folder.conceiled,
    },
  ]}
>
  <img src={FolderIcon} alt="" />
  <span>{folder.name}</span>
</button>
