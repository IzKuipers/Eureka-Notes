<script lang="ts">
  import { draggable } from "@neodrag/svelte";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { ExistingNoteShareDialog } from "../../dialogs/ExistingNoteShare/ExistingNoteShare";
  import { Preferences } from "../../ts/api/stores";
  import { formatBytes } from "../../ts/bytes";
  import type { EditorState } from "../../ts/state/editor";
  import { GlobalViewerState } from "../../ts/state/viewer";
  import CenterLoader from "../CenterLoader.svelte";
  import StatusBar from "../StatusBar.svelte";
  import Segment from "../StatusBar/Segment.svelte";

  const { state: State }: { state: EditorState } = $props();
  const { fullNote, writing, collapsed, modified, path, loading } = State;
  const { maxZIndex } = GlobalViewerState!;

  let zIndex = $state<number>($maxZIndex + 1);
  let editor = $state<HTMLDivElement>();
  let textarea = $state<HTMLTextAreaElement>();
  let timeout: number | undefined;

  $Preferences.zoomLevel ??= 100;

  function updateZIndex() {
    zIndex = ++$maxZIndex;
    editor!.style.zIndex = zIndex.toString();
  }

  onMount(() => {
    updateZIndex();
    textarea?.addEventListener("keydown", (e) => {
      $modified = true;

      oninput();

      if (e.key !== "Tab") return;

      const start = textarea!.selectionStart;
      const end = textarea!.selectionEnd;

      $fullNote.data = textarea!.value.substring(0, start) + "\t" + textarea!.value.substring(end);
      setTimeout(() => {
        textarea!.selectionStart = textarea!.selectionEnd = start + 1;
      });
    });
  });

  function oninput() {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      State.writeData();
    }, 1000 * 60); // auto-save: 1min
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
    bounds: { top: 0, left: -430, right: -430, bottom: -380 },
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
        <button
          class="share lucide icon-share"
          aria-label="Share note"
          disabled={$writing}
          onclick={() => ExistingNoteShareDialog.Invoke($fullNote._id)}
        ></button>
      {/if}
      <button
        class="collapser lucide no-mobile"
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
      <textarea
        name=""
        id=""
        bind:value={$fullNote.data}
        style="--font-size: {(12 / 100) * ($Preferences.zoomLevel ?? 100)}px;"
        {oninput}
        onclick={oninput}
        readonly={$writing}
        spellcheck={false}
        bind:this={textarea}
      ></textarea>
      {#if $loading}
        <CenterLoader />
      {/if}
    </div>
    <StatusBar>
      <Segment unimportant>
        {formatBytes($fullNote.data.length)}
      </Segment>
      {#snippet rightContent()}
        <Segment className="zoom-level no-mobile">
          <!-- svelte-ignore a11y_consider_explicit_label -->
          <button class="lucide icon-minus" onclick={() => ($Preferences.zoomLevel! -= 5)}></button>
          <span class="level">{$Preferences.zoomLevel ?? 100}%</span>
          <button class="lucide icon-plus" onclick={() => ($Preferences.zoomLevel! += 5)}></button>
        </Segment>
        <Segment unimportant>Last saved: {$writing ? "saving..." : dayjs($fullNote.updatedAt).format("DD/MM/YYYY HH:mm")}</Segment
        >
      {/snippet}
    </StatusBar>
  {/if}
</div>
