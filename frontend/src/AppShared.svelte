<script lang="ts">
  import dayjs from "dayjs";
  import { AboutDialog } from "./dialogs/About/About";
  import CenterLoader from "./lib/CenterLoader.svelte";
  import ContextMenuRenderer from "./lib/ContextMenuRenderer.svelte";
  import DialogRenderer from "./lib/DialogRenderer.svelte";
  import ModularityRenderer from "./lib/ModularityRenderer.svelte";
  import StatusBar from "./lib/StatusBar.svelte";
  import Segment from "./lib/StatusBar/Segment.svelte";
  import { EurekaVersion } from "./ts/api/stores";
  import { contextMenu } from "./ts/state/context";
  import { GlobalShareState } from "./ts/state/share";
  import { SEP_ITEM } from "./types/context";

  const { shareInfo, loading } = GlobalShareState!;
</script>

<div
  class="shared-note"
  use:contextMenu={[
    {
      caption: "Refresh",
      action: () => GlobalShareState!.initialize(GlobalShareState!.password),
    },
    {
      caption: "Copy link",
      action: () => navigator.clipboard.writeText(`${location.origin}/?share=${GlobalShareState?.shareValue!}`),
    },
    SEP_ITEM,
    {
      caption: "About Eureka",
      action: () => AboutDialog.Invoke(),
    },
  ]}
>
  <div class="shared-topbar">
    <div class="branding">
      <span class="lucide icon-brain"></span>
      <span class="name">EUREKA</span>
      <span class="shared">Shared</span>
    </div>
    {#if $shareInfo}
      <div class="note-info">
        <div class="name">{$shareInfo.noteName}</div>
        <div class="author">By {$shareInfo.username}</div>
      </div>
    {/if}
    <span class="version">v{$EurekaVersion}</span>
    <button onclick={() => (location.href = `./`)}>Open Eureka</button>
  </div>
  {#if $loading}
    <CenterLoader />
  {:else if $shareInfo}
    <div class="content">
      {$shareInfo?.data}
    </div>
    <StatusBar>
      <Segment>{$shareInfo.noteName}</Segment>
      <Segment unimportant>In {$shareInfo.folderName}</Segment>
      {#snippet rightContent()}
        <Segment unimportant>Last updated: {dayjs($shareInfo.updatedAt).format("DD/MM/YYYY HH:mm")}</Segment>
      {/snippet}
    </StatusBar>
  {/if}
</div>
<DialogRenderer />
<ModularityRenderer />
<ContextMenuRenderer />
