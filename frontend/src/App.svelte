<script lang="ts">
  import DialogRenderer from "./lib/DialogRenderer.svelte";
  import OfflineLayout from "./OfflineLayout.svelte";
  import OnlineLayout from "./OnlineLayout.svelte";
  import { Connected } from "./ts/api/stores";
</script>

{#if $Connected}
  <OnlineLayout />
{:else}
  <OfflineLayout />
{/if}

<DialogRenderer />
