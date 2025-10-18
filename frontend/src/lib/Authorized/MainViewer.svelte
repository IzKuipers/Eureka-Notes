<script lang="ts">
  import { FolderIcon } from "../../ts/images";
  import { GlobalOpenedState } from "../../ts/state/opened";
  import { GlobalViewerState } from "../../ts/state/viewer";
  import { GetParentDirectory } from "../../ts/util";
  import CenterLoader from "../CenterLoader.svelte";
  import FolderButton from "./MainViewer/FolderButton.svelte";
  import NoteButton from "./MainViewer/NoteButton.svelte";
  const { loading, read, path } = GlobalViewerState!;
</script>

<div class="main-viewer">
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
  <div class="new-options">
    <button class="viewer-item new-option" ondblclick={() => GlobalOpenedState?.newNote()}>
      <span>New note</span>
      <span class="lucide icon-plus"></span>
    </button>
    <button class="viewer-item new-option" ondblclick={() => GlobalOpenedState?.newFolder()}>
      <span>New folder</span>
      <span class="lucide icon-plus"></span>
    </button>
  </div>
  {#if $loading}
    <CenterLoader />
  {/if}
</div>
