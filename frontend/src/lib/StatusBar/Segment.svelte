<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title?: string;
    unimportant?: boolean;
    children: Snippet;
    className?: string;
    flex?: boolean
  }

  const { title = "", unimportant = false, children, className = "", flex = false }: Props = $props();
</script>

<div class={`segment ${className}`.trim()} class:unimportant class:flex {title}>
  <span>{@render children()}</span>
</div>
