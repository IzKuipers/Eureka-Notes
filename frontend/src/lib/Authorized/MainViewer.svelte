<script lang="ts">
  import { onMount } from "svelte";
  import { AboutDialog } from "../../dialogs/About/About";
  import { Preferences } from "../../ts/api/stores";
  import { FolderIcon } from "../../ts/images";
  import { contextMenu } from "../../ts/state/context";
  import { GetParentDirectory } from "../../ts/util";
  import { SEP_ITEM } from "../../types/context";
  import type { PartialEurekaNote } from "../../types/note";
  import CenterLoader from "../CenterLoader.svelte";
  import FolderButton from "./MainViewer/FolderButton.svelte";
  import NoteButton from "./MainViewer/NoteButton.svelte";
  import { ViewerState } from "../../ts/state/viewer";
  import { OpenedState } from "../../ts/state/opened";

  const { loading, read, path, selection } = ViewerState!;
  const { hasCollapsed } = OpenedState!;

  let pinned = $state<PartialEurekaNote[]>([]);

  onMount(() => {
    read.subscribe((v) => {
      pinned = v?.notes.filter((p) => p.pinned) ?? [];
    });
  });
</script>

<div
  class="main-viewer"
  class:has-collapsed={$hasCollapsed}
  use:contextMenu={[
    {
      caption: "New note",
      action: () => OpenedState.newNote(),
    },
    {
      caption: "New folder",
      action: () => OpenedState.newFolder(),
    },
    SEP_ITEM,
    {
      caption: "Select all",
      action: () => ViewerState.selection.set($read?.notes || []),
    },
    {
      caption: "Import...",
      action: () => ViewerState.importNotes(),
    },
    SEP_ITEM,
    {
      caption: "Rename selection",
      action: () => ViewerState.renameSelection(),
      disabled: () => selection().length !== 1,
    },
    {
      caption: "Delete selection",
      action: () => ViewerState.deleteSelection(),
      disabled: () => !selection().length,
    },
    {
      caption: "Move selection",
      action: () => ViewerState.moveSelection(),
      disabled: () => !selection().length,
    },
    SEP_ITEM,
    {
      caption: "Refresh",
      action: () => ViewerState.refresh(),
    },
    SEP_ITEM,
    {
      caption: "About Eureka",
      action: () => AboutDialog.Invoke(),
    },
  ]}
>
  <div class="listing view-{$Preferences.viewMode}">
    {#if pinned?.length}
      {#each pinned as note, i (note._id)}
        <NoteButton {note} {i} />
      {/each}
      <hr />
    {/if}
    {#if $path && $path !== "/"}
      <button class="viewer-item parent" onclick={() => ViewerState?.navigate(GetParentDirectory($path))}>
        <img src={FolderIcon} alt="" />
        <span>..</span>
        <span class="lucide icon-corner-left-up"></span>
      </button>
    {/if}
    {#each $read?.folders as folder (folder._id)}
      <FolderButton {folder} />
    {/each}
    {#each $read?.notes.filter((n) => !n.pinned) as note, i (note._id)}
      <NoteButton {note} {i} />
    {/each}
  </div>
  {#if $loading}
    <CenterLoader />
  {/if}
</div>
