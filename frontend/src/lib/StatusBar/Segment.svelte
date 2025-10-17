<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title?: string;
    unimportant?: boolean;
    children: Snippet;
    className?: string;
  }

  const { title = "", unimportant = false, children, className = "" }: Props = $props();
</script>

<div class={`segment ${className}`.trim()} class:unimportant {title}>
  <span>{@render children()}</span>
</div>
