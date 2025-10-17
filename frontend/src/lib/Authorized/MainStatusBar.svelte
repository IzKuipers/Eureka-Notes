<script lang="ts">
  import dayjs from "dayjs";
  import { onDestroy, onMount } from "svelte";
  import { GlobalViewerState } from "../../ts/state";
  import Segment from "../StatusBar/Segment.svelte";
  import StatusBar from "../StatusBar.svelte";
  import { formatBytes } from "../../ts/bytes";

  const { read, status, selection } = GlobalViewerState!;

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
  <Segment className="status">{$status}</Segment>
  {#snippet rightContent()}
    <Segment unimportant>{currentTime}</Segment>
    <Segment unimportant>
      {#if !$selection?.length}
        No selection
      {:else if $selection.length === 1}
        Selecting {$selection[0].name}
      {:else}
        Selecting {$selection.length} notes
      {/if}
    </Segment>
  {/snippet}
</StatusBar>
