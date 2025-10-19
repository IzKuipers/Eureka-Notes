<script lang="ts">
  import { ViewerReady } from "../ts/state/viewer";
  import MainStatusBar from "./Authorized/MainStatusBar.svelte";
  import MainViewer from "./Authorized/MainViewer.svelte";
  import OpenedRenderer from "./Authorized/OpenedRenderer.svelte";
  import UserBar from "./Authorized/UserBar.svelte";
  import CenterLoader from "./CenterLoader.svelte";
  import ContextMenuRenderer from "./ContextMenuRenderer.svelte";
  import ModularityRenderer from "./ModularityRenderer.svelte";
</script>

<main class="authorized">
  {#if $ViewerReady}
    <div class="content">
      <MainViewer />
      <OpenedRenderer />
    </div>
    <UserBar />
    <MainStatusBar />
  {:else}
    <CenterLoader />
  {/if}
  <ModularityRenderer />
  <ContextMenuRenderer />
</main>
