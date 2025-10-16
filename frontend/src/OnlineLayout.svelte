<script>
  import Authorized from "./lib/Authorized.svelte";
  import Unauthorized from "./lib/Unauthorized.svelte";
  import { LoggedIn } from "./ts/api/stores";
</script>

{#if $LoggedIn}
  <Authorized />
{:else}
  <Unauthorized />
{/if}
