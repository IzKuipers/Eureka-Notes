<script lang="ts">
  import type { SharePasswordDialog } from "./SharePasswordDialog";

  const { dialog }: { dialog: SharePasswordDialog } = $props();
  const { password } = dialog;

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      dialog.unlock();
    }
  }
</script>

<div class="dialog-body">
  <h1>Enter password</h1>
  <p>Please enter the provided password to access this note. If you don't have it, please ask the author.</p>
  <input type="password" placeholder="Password" bind:value={$password} {onkeydown} />
</div>
