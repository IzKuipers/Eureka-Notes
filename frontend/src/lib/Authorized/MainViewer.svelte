<script lang="ts">
  import { FolderIcon } from "../../ts/images";
  import { contextMenu } from "../../ts/state/context";
  import { GlobalOpenedState } from "../../ts/state/opened";
  import { GlobalViewerState } from "../../ts/state/viewer";
  import { GetParentDirectory } from "../../ts/util";
  import { SEP_ITEM } from "../../types/context";
  import CenterLoader from "../CenterLoader.svelte";
  import FolderButton from "./MainViewer/FolderButton.svelte";
  import NoteButton from "./MainViewer/NoteButton.svelte";
  const { loading, read, path } = GlobalViewerState!;
</script>

<div
  class="main-viewer"
  use:contextMenu={[
    {
      caption: "New note",
      action: () => GlobalOpenedState?.newNote(),
    },
    {
      caption: "New folder",
      action: () => GlobalOpenedState?.newFolder(),
    },
    SEP_ITEM,
    {
      caption: "Select all",
      action: () => GlobalViewerState?.selection.set($read?.notes || []),
    },
    {
      caption: "Import...",
      action: () => GlobalViewerState?.importNotes(),
    },
    SEP_ITEM,
    {
      caption: "Rename selection",
      action: () => GlobalViewerState?.renameSelection(),
    },
    {
      caption: "Delete selection",
      action: () => GlobalViewerState?.deleteSelection(),
    },
    {
      caption: "Move selection",
      action: () => GlobalViewerState?.moveSelection(),
    },
  ]}
>
  <div class="listing">
    {#if $path && $path !== "/"}
      <button class="viewer-item parent" ondblclick={() => GlobalViewerState?.navigate(GetParentDirectory($path))}>
        <img src={FolderIcon} alt="" />
        <span>..</span>
        <span class="lucide icon-corner-left-up"></span>
      </button>
    {/if}
    {#each $read?.folders as folder (folder._id)}
      <FolderButton {folder} />
    {/each}
    {#each $read?.notes as note, i (note._id)}
      <NoteButton {note} {i} />
    {/each}
  </div>
  {#if $loading}
    <CenterLoader />
  {/if}
</div>
