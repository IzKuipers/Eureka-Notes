<script lang="ts">
  import { draggable } from "@neodrag/svelte";
  import { formatBytes } from "../../ts/bytes";
  import type { EditorState } from "../../ts/state/editor";
  import StatusBar from "../StatusBar.svelte";
  import Segment from "../StatusBar/Segment.svelte";
  import { GlobalViewerState } from "../../ts/state/viewer";
  import CenterLoader from "../CenterLoader.svelte";

  const { state: State }: { state: EditorState } = $props();
  const { fullNote, writing, collapsed, modified, path, loading } = State;
  const { maxZIndex } = GlobalViewerState!;
  let zIndex = $state<number>($maxZIndex + 1);
  let editor = $state<HTMLDivElement>();

  function updateZIndex() {
    zIndex = ++$maxZIndex;
    editor!.style.zIndex = zIndex.toString();
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="dialog note-editor"
  class:collapsed={$collapsed}
  bind:this={editor}
  onclick={updateZIndex}
  use:draggable={{
    disabled: $collapsed,
    handle: ".dialog-title",
    defaultPosition: { x: 0, y: 0 },
    cancel: ".title-actions",
  }}
  onmousedown={updateZIndex}
>
  <div class="dialog-title">
    <div class="title">
      {#if !$collapsed}
        {$path}{$modified ? " *" : ""}
      {:else}
        {$fullNote.name}{$modified ? " *" : ""}
      {/if}
    </div>
    <div class="title-actions">
      {#if !$collapsed}
        <button class="save lucide icon-save" aria-label="Save note" disabled={$writing} onclick={() => State.writeData()}
        ></button>
      {/if}
      <button
        class="collapser lucide"
        class:icon-minimize-2={!$collapsed}
        class:icon-maximize-2={$collapsed}
        aria-label="Collapse"
        onclick={() => ($collapsed = !$collapsed)}
      ></button>
      <button class="close lucide icon-x" aria-label="Close" onclick={() => State.close()} disabled={$writing}></button>
    </div>
  </div>
  {#if !$collapsed}
    <div class="dialog-body">
      <textarea name="" id="" bind:value={$fullNote.data}></textarea>
      {#if $writing || $loading}
        <CenterLoader />
      {/if}
    </div>
    <StatusBar>
      <Segment unimportant>
        {formatBytes($fullNote.data.length)}
      </Segment>
    </StatusBar>
  {/if}
</div>
