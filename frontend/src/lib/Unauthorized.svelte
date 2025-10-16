<script lang="ts">
  import Login from "./Unauthorized/Login.svelte";
  import Register from "./Unauthorized/Register.svelte";

  let registering = $state<boolean>(false);
</script>

{#if registering}
  <Register {registering} />
{:else}
  <Login {registering} />
{/if}
