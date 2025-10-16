<script lang="ts">
  import { GlobalServerConnector } from "../../ts/api";

  let { registering = $bindable() }: { registering: boolean } = $props();

  let username = $state<string>();
  let password = $state<string>();
  let confirmPassword = $state<string>();
  let loading = $state<boolean>(false);

  async function Register() {
    if (!username || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      // TODO : DIALOG HERE
      return;
    }

    loading = true;
    await GlobalServerConnector?.register(username, password);
    loading = false;
    registering = false;
  }
</script>

<div class="fill-absolute flex-center login-screen">
  <div class="dialog">
    <div class="dialog-body">
      <div class="header">
        <h1>Register</h1>
        <p>To store your notes here</p>
      </div>

      <div class="field username">
        <label for="registerUsernameField">Username</label>
        <input type="text" id="registerUsernameField" bind:value={username} />
      </div>

      <div class="field password">
        <label for="registerPasswordField">Password</label>
        <input type="password" id="registerPasswordField" bind:value={password} />
      </div>

      <div class="field password">
        <label for="registerPasswordConfirmField">Confirm password</label>
        <input type="password" id="registerPasswordConfirmField" bind:value={confirmPassword} />
      </div>
    </div>
    <div class="dialog-actions">
      <button onclick={() => (registering = false)}>Log in...</button>
      <button onclick={Register} disabled={!username || !password || !confirmPassword}>Register</button>
    </div>
  </div>
</div>
