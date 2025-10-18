<script lang="ts">
  import { GlobalModularityState } from "../ts/state/modular";
  import ModularityDialog from "./ModularityRenderer/ModularityDialog.svelte";

  const { store } = GlobalModularityState!;
</script>

<div class="modularity-dialog-renderer">
  {#each [...$store] as [key, dialog] (key)}
    <ModularityDialog {key} {dialog} />
  {/each}
</div>
