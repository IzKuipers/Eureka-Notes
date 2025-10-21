<script lang="ts">
  import type { DialogButton, ModularityDialogInstance } from "../../../types/dialog";

  let { button, key, dialog }: { button: DialogButton; key: string; dialog: ModularityDialogInstance } = $props();
  
  const { loading } = dialog;
  async function execute() {
    $loading = true;
    await button.action?.();
    $loading = false;
  }
</script>

<button class={button.className} disabled={$loading} onclick={execute}>{button.caption}</button>
