<script lang="ts">
  import type { SharePasswordDialog } from "./SharePasswordDialog";

  const { dialog }: { dialog: SharePasswordDialog } = $props();
  const { password } = dialog;
</script>

<div class="dialog-body">
  <h1>Enter password</h1>
  <p>Please enter the provided password to access this note:</p>
  <input type="password" placeholder="Password" bind:value={$password} />
</div>
