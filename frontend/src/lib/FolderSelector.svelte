<script lang="ts">
  import { onMount } from "svelte";
  import { GlobalServerConnector } from "../ts/api";
  import { FolderIcon } from "../ts/images";
  import type { FolderRead } from "../types/folder";
  import CenterLoader from "./CenterLoader.svelte";

  let currentFolder = $state<FolderRead | undefined>();
  let loading = $state<boolean>(true);

  let { startFolderId, outFolderId = $bindable() }: { startFolderId: string; outFolderId: string } = $props();

  onMount(async () => {
    await navigate(startFolderId || "");
  });

  async function navigate(folderId?: string) {
    loading = true;
    currentFolder = await GlobalServerConnector?.readFolderById(folderId || "");
    outFolderId = currentFolder?.folderId || "";
    loading = false;
  }
</script>

<div class="folder-selector">
  <div class="header">
    <button class="lucide icon-arrow-up" onclick={() => navigate(currentFolder?.parentFolderId)} aria-label="Parent folder"
    ></button>
    <p class="path">In {currentFolder?.folderName || "/"}</p>
  </div>
  <div class="listing" class:not-found={!loading && !currentFolder}>
    {#if !loading}
      {#if currentFolder}
        {#each currentFolder.folders as folder (folder._id)}
          <button class="folder-button" onclick={() => navigate(folder._id)}>
            <img src={FolderIcon} alt="" />
            <span>{folder.name}</span>
          </button>
        {/each}
      {:else}
        404
      {/if}
    {:else}
      <CenterLoader />
    {/if}
  </div>
</div>
