<script lang="ts">
  import type { DialogButton } from "../../../types/dialog";

  let { button, key, loading = $bindable() }: { button: DialogButton; key: string; loading: boolean } = $props();

  async function execute() {
    loading = true;
    await button.action?.();
    loading = false;
  }
</script>

<button class={button.className} disabled={loading} onclick={execute}>{button.caption}</button>
