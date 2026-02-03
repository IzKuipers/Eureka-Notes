<script lang="ts">
  import CenterLoader from "../../lib/CenterLoader.svelte";
  import { NoteIcon } from "../../ts/images";
  import { GlobalViewerState } from "../../ts/state/viewer";
  import type { SearchDialog } from "./SearchDialog";

  const { dialog }: { dialog: SearchDialog } = $props();
  const { searching, loading, results, everywhere } = dialog;
  const { read } = GlobalViewerState!;

  let query = $state<string>("");

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Enter") dialog.search(query);
    if (e.key === "Escape") dialog.close();
  }
</script>

{#if $searching}
  <div class="dialog-body">
    {#if $loading}
      <CenterLoader />
    {:else if $results.length}
      {#each $results as { item }, i (item._id)}
        <button class="result" onclick={() => dialog.openNote(item)}>
          <img src={NoteIcon} alt="" />
          <span class="name">{item.name}</span>
          <span class="index">#{i}</span>
        </button>
      {/each}
    {:else}
      <p class="no-results">No results.</p>
    {/if}
  </div>
  <div class="dialog-actions">
    <p class="location">
      {#if everywhere}
        Searched everywhere
      {:else}
        Searched in just {$read?.folderName || "/"}
      {/if}
    </p>
    <!-- svelte-ignore a11y_autofocus -->
    <button onclick={() => dialog.reset()} disabled={$loading} autofocus>New search</button>
    <button class="red" disabled={$loading} onclick={() => dialog.close()}>Close</button>
  </div>
{:else}
  <div class="search-box">
    <span class="lucide icon-search"></span>
    <!-- svelte-ignore a11y_autofocus -->
    <input
      type="text"
      placeholder={everywhere ? "Search everywhere" : `Search the notes in just ${$read?.folderName || "/"}`}
      bind:value={query}
      {onkeydown}
      autofocus
    />
  </div>
{/if}
