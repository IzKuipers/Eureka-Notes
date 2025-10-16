<script lang="ts">
  import { GlobalServerConnector } from "../../ts/api";

  let { registering = $bindable() }: { registering: boolean } = $props();

  let username = $state<string>();
  let password = $state<string>();
  let loading = $state<boolean>(false);

  async function Login() {
    if (!username || !password) return;

    loading = true;
    await GlobalServerConnector?.login(username, password);
    loading = false;
  }
</script>

<div class="fill-absolute flex-center login-screen">
  <div class="dialog">
    <div class="dialog-body">
      <div class="header">
        <h1>Log In</h1>
        <p>To continue to your notes</p>
      </div>

      <div class="field username">
        <label for="usernameField">Username</label>
        <input type="text" id="usernameField" bind:value={username} />
      </div>

      <div class="field password">
        <label for="passwordField">Password</label>
        <input type="password" id="passwordField" bind:value={password} />
      </div>
    </div>
    <div class="dialog-actions">
      <button onclick={() => (registering = true)}>Register...</button>
      <button onclick={Login} disabled={!username || !password}>Log in</button>
    </div>
  </div>
</div>
