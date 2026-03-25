<script lang="ts">
  import { onMount } from "svelte";
  import { ShowDialog } from "./ts/dialog";

  onMount(async () => {
    ShowDialog({
      title: "Eureka isn't available right now",
      message: "The Eureka server could not be reached. Grab a cup of coffee, and come back to try again.",
      buttons: [{ caption: "Retry", action: () => location.reload(), autofocus: true }],
      icon:"coffee"
    });
  });
</script>
