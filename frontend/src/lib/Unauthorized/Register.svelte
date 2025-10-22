<script lang="ts">
  import { GlobalServerConnector } from "../../ts/api";
  import { BuildHash, EurekaVersion } from "../../ts/api/stores";
  import { BlockingOkay } from "../../ts/dialog";
  import { OnEnterJumpTo } from "../../ts/util";
  import StatusBar from "../StatusBar.svelte";
  import Segment from "../StatusBar/Segment.svelte";

  let { registering = $bindable() }: { registering: boolean } = $props();

  let username = $state<string>();
  let password = $state<string>();
  let confirmPassword = $state<string>();
  let loading = $state<boolean>(false);

  async function Register() {
    if (!username || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      await BlockingOkay("Can't register", "The passwords you entered don't match. Please try again.");
      return;
    }

    loading = true;
    const result = await GlobalServerConnector?.register(username, password);
    loading = false;

    if (!result) {
      await BlockingOkay(
        "Registration failed",
        "Your account could not be created. The username you tried to use is already in use by someone else.",
      );

      return;
    }

    registering = false;
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "Enter") Register();
  }
</script>

<div class="fill-absolute login-screen">
  <div class="login-wrapper flex-center">
    <div class="dialog">
      <div class="dialog-body">
        <div class="header">
          <h1>Register</h1>
          <p>To store your notes here</p>
        </div>

        <div class="field username">
          <label for="registerUsernameField">Username</label>
          <!-- svelte-ignore a11y_autofocus -->
          <input type="text" id="registerUsernameField" bind:value={username} onkeydown={OnEnterJumpTo("#registerPasswordField")} autofocus />
        </div>

        <div class="field password">
          <label for="registerPasswordField">Password</label>
          <input type="password" id="registerPasswordField" bind:value={password} onkeydown={OnEnterJumpTo("#registerPasswordConfirmField")} />
        </div>

        <div class="field password">
          <label for="registerPasswordConfirmField">Confirm password</label>
          <input type="password" id="registerPasswordConfirmField" bind:value={confirmPassword} {onkeydown}/>
        </div>
      </div>
      <div class="dialog-actions">
        <button onclick={() => (registering = false)}>Log in...</button>
        <button onclick={Register} disabled={!username || !password || !confirmPassword}>Register</button>
      </div>
    </div>
  </div>
  <StatusBar>
    <Segment unimportant>Version {$EurekaVersion}</Segment>
    <Segment unimportant>{$BuildHash}</Segment>
    <Segment className="status no-mobile">Registering for Eureka</Segment>
  </StatusBar>
</div>
