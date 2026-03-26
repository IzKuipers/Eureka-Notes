<script lang="ts">
  import { ModularDialogState } from "../ts/state/modular";
  import ModularDialogRenderer from "./ModularDialogRenderer/ModularDialog.svelte";

  const { store } = ModularDialogState;
</script>

<div class="modular-dialog-renderer">
  {#each [...$store] as [key, dialog] (key)}
    <ModularDialogRenderer {key} {dialog} />
  {/each}
</div>
