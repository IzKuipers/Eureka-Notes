<script lang="ts">
  import dayjs from "dayjs";
  import { onDestroy, onMount } from "svelte";
  import { Preferences } from "../../ts/api/stores";
  import { formatBytes } from "../../ts/bytes";
  import { GlobalViewerState } from "../../ts/state/viewer";
  import StatusBar from "../StatusBar.svelte";
  import Segment from "../StatusBar/Segment.svelte";

  const { read, status, selection } = GlobalViewerState!;
  Preferences;
  let currentTime = $state<string>();
  let interval: number;

  onMount(() => {
    interval = setInterval(() => {
      currentTime = dayjs().format("DD/MM/YYYY HH:mm");
    });
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<StatusBar>
  <Segment unimportant>{$read?.folders.length ?? 0} folders</Segment>
  <Segment unimportant>{$read?.notes.length ?? 0} notes</Segment>
  <Segment unimportant>{formatBytes($read?.totalSize ?? 0)}</Segment>
  <Segment className="status no-mobile">{$status}</Segment>
  {#snippet rightContent()}
    <Segment unimportant className="no-mobile">{currentTime}</Segment>
    <Segment unimportant className="no-mobile">
      {#if !$selection?.length}
        No selection
      {:else if $selection.length === 1}
        Selecting {$selection[0].name}
      {:else}
        Selecting {$selection.length} notes
      {/if}
    </Segment>
    <Segment flex>
      <button
        class="lucide icon-table"
        onclick={() => ($Preferences.viewMode = "grid")}
        class:selected={$Preferences.viewMode === "grid"}
        title="Small grid"
      ></button>
      <button
        class="lucide icon-layout-grid"
        onclick={() => ($Preferences.viewMode = "large-grid")}
        class:selected={$Preferences.viewMode === "large-grid"}
        title="Large grid"
      ></button>
      <button
        class="lucide icon-list"
        onclick={() => ($Preferences.viewMode = "list")}
        class:selected={$Preferences.viewMode === "list"}
        title="List"
      ></button>
    </Segment>
  {/snippet}
</StatusBar>
