<script lang="ts">
  import { onMount } from "svelte";
  import { GlobalServerConnector } from "../../ts/api";
  import { BlockingOkay } from "../../ts/dialog";
  import Cookies from "js-cookie";
  import StatusBar from "../StatusBar.svelte";
  import Segment from "../StatusBar/Segment.svelte";
  import { BuildHash, EurekaVersion } from "../../ts/api/stores";

  let { registering = $bindable() }: { registering: boolean } = $props();

  let username = $state<string>();
  let password = $state<string>();
  let loading = $state<boolean>(false);
  let passwordField = $state<HTMLInputElement>()

  onMount(() => {
    username = Cookies.get("eurekaUsername") || "";
  });

  async function Login() {
    if (!username || !password) return;

    loading = true;
    const token = await GlobalServerConnector?.login(username, password);

    if (!token) {
      await BlockingOkay("Login failed", "The credentials you entered are invalid. Please try again.");
    }

    loading = false;
  }

  function onUsernameKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") passwordField?.focus();
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Enter") Login();
  }
</script>

<div class="fill-absolute login-screen">
  <div class="login-wrapper flex-center">
    <div class="dialog">
      <div class="dialog-body">
        <div class="header">
          <h1>Log In</h1>
          <p>To continue to your notes</p>
        </div>

        <div class="field username">
          <label for="usernameField">Username</label>
          <input type="text" id="usernameField" bind:value={username} disabled={loading} />
        </div>

        <div class="field password">
          <label for="passwordField">Password</label>
          <input type="password" id="passwordField" bind:this={passwordField} bind:value={password} {onkeydown} disabled={loading} />
        </div>
      </div>
      <div class="dialog-actions">
        <button onclick={() => (registering = true)}>Register...</button>
        <button onclick={Login} disabled={!username || !password}>Log in</button>
      </div>
    </div>
  </div>
  <StatusBar>
    <Segment unimportant>Version {$EurekaVersion}</Segment>
    <Segment unimportant>{$BuildHash}</Segment>
    <Segment className="status no-mobile">Logging in to Eureka</Segment>
  </StatusBar>
</div>
