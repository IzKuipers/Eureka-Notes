<script lang="ts">
  import { onMount } from "svelte";

  let visible = $state<boolean>(false);

  onMount(() => setTimeout(() => (visible = true)));
</script>

<div class="loader fill-absolute flex-center" class:visible></div>
