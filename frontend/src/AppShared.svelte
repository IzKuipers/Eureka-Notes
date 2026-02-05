<script lang="ts">
  import DialogRenderer from "./lib/DialogRenderer.svelte";
  import ModularityRenderer from "./lib/ModularityRenderer.svelte";
  import { GlobalShareState } from "./ts/state/share";

  const { shareInfo } = GlobalShareState!;
</script>

{$shareInfo?.data}
<DialogRenderer />
<ModularityRenderer />
