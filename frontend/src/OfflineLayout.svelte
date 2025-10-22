<script lang="ts">
  import { onMount } from "svelte";
  import { ShowDialog } from "./ts/dialog";

  onMount(async () => {
    ShowDialog({
      title: "Eureka offline",
      message: "The server could not be reached",
      buttons: [{ caption: "Retry", action: () => location.reload(), autofocus: true }],
    });
  });
</script>
