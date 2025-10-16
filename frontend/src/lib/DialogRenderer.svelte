<script lang="ts">
  import { Dialogs } from "../ts/dialog";
  import MessageDialog from "./DialogRenderer/MessageDialog.svelte";
</script>

<div class="message-dialog-renderer">
  {#each [...$Dialogs] as [key, dialog] (key)}
    <MessageDialog {key} {dialog} />
  {/each}
</div>
