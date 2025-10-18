<script lang="ts">
  const { value = 0, max = 100 }: { value?: number; max?: number } = $props();
</script>

<div class="progress-bar" style="--progress: {(100 / max) * value}%">
  <div class="inner"></div>
</div>
