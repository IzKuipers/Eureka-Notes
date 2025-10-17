<script lang="ts">
  import MainStatusBar from "./Authorized/MainStatusBar.svelte";
  import MainViewer from "./Authorized/MainViewer.svelte";
  import OpenedRenderer from "./Authorized/OpenedRenderer.svelte";
  import UserBar from "./Authorized/UserBar.svelte";
</script>

<main class="authorized">
  <div class="content">
    <MainViewer />
    <OpenedRenderer />
  </div>
  <UserBar />
  <MainStatusBar />
</main>
