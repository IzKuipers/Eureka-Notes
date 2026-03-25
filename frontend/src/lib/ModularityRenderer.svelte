<script lang="ts">
  import { ModularityState } from "../ts/state/modular";
  import ModularityDialog from "./ModularityRenderer/ModularityDialog.svelte";

  const { store } = ModularityState!;
</script>

<div class="modularity-dialog-renderer">
  {#each [...$store] as [key, dialog] (key)}
    <ModularityDialog {key} {dialog} />
  {/each}
</div>
