<script lang="ts">
  import { onMount } from "svelte";
  import StatusBar from "../../lib/StatusBar.svelte";
  import Segment from "../../lib/StatusBar/Segment.svelte";
  import { Preferences } from "../../ts/api/stores";
  import { formatBytes } from "../../ts/bytes";
  import { GlobalViewerState } from "../../ts/state/viewer";
  import type { NewNoteDialog } from "./NewNote";
  import CenterLoader from "../../lib/CenterLoader.svelte";

  const { dialog }: { dialog: NewNoteDialog } = $props();
  const { saveName, saveContent, loading } = dialog;
  const { path } = GlobalViewerState!;

  let textarea = $state<HTMLTextAreaElement>();

  onMount(() => {
    textarea?.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;

      const start = textarea!.selectionStart;
      const end = textarea!.selectionEnd;

      textarea!.value = textarea!.value.substring(0, start) + "\t" + textarea!.value.substring(end);
      textarea!.selectionStart = textarea!.selectionEnd = start + 1;
    });
  });

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Enter") dialog.save();
  }
</script>

<div class="dialog-title">
  <div class="title">New note - {$path ? `${$path}/` : "/"}</div>
  <input type="text" bind:value={$saveName} {onkeydown} readonly={$loading} />
  <div class="title-actions">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="lucide icon-save" onclick={() => dialog.save()} disabled={$loading}></button>
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="lucide icon-x" onclick={() => dialog.discard()} disabled={$loading}></button>
  </div>
</div>
<div class="dialog-body">
  <!-- svelte-ignore a11y_autofocus -->
  <textarea
    name=""
    id=""
    bind:value={$saveContent}
    bind:this={textarea}
    autofocus
    readonly={$loading}
    style="--font-size: {(12 / 100) * ($Preferences.zoomLevel ?? 100)}px;"
  ></textarea>
  {#if $loading}
    <CenterLoader />
  {/if}
</div>
<StatusBar>
  <Segment unimportant>
    {formatBytes($saveContent?.length ?? 0)}
  </Segment>
  {#snippet rightContent()}
    <Segment className="zoom-level">
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button class="lucide icon-minus" onclick={() => ($Preferences.zoomLevel! -= 5)}></button>
      <span class="level">{$Preferences.zoomLevel ?? 100}%</span>
      <button class="lucide icon-plus" onclick={() => ($Preferences.zoomLevel! += 5)}></button>
    </Segment>
  {/snippet}
</StatusBar>
