<script lang="ts">
  import StatusBar from "../../lib/StatusBar.svelte";
  import Segment from "../../lib/StatusBar/Segment.svelte";
  import { Preferences } from "../../ts/api/stores";
  import { formatBytes } from "../../ts/bytes";
  import { GlobalViewerState } from "../../ts/state/viewer";
  import type { NewNoteDialog } from "./NewNote";

  const { dialog }: { dialog: NewNoteDialog } = $props();
  const { saveName, saveContent } = dialog;
  const { path } = GlobalViewerState!;

  GlobalViewerState?.status.set("Creating a new note");
</script>

<div class="dialog-title">
  <div class="title">New note - {$path ? `${$path}/` : "/"}</div>
  <input type="text" bind:value={$saveName} />
  <div class="title-actions">
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="lucide icon-save" onclick={() => dialog.save()}></button>
    <!-- svelte-ignore a11y_consider_explicit_label -->
    <button class="lucide icon-x" onclick={() => dialog.discard()}></button>
  </div>
</div>
<div class="dialog-body">
  <textarea name="" id="" bind:value={$saveContent}></textarea>
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
