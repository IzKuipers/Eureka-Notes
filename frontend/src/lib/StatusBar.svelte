<script lang="ts">
  import type { Snippet } from "svelte";

  const { className = "", children, rightContent }: { className?: string; children: Snippet; rightContent?: Snippet } = $props();
</script>

<div class="status-bar {className}">
  {@render children()}
  <div class="right">
    {@render rightContent?.()}
  </div>
</div>
