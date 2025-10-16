<script lang="ts">
  import Login from "./Unauthorized/Login.svelte";
  import Register from "./Unauthorized/Register.svelte";

  let registering = $state<boolean>(false);
</script>

{#if registering}
  <Register bind:registering />
{:else}
  <Login bind:registering />
{/if}
