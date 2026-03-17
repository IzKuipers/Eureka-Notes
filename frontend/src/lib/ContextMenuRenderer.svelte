<script lang="ts">
  import { GlobalContextMenuState } from "../ts/state/context";
  import { UUID } from "../ts/uuid";

  const { current } = GlobalContextMenuState!;
</script>

<div class="context-menu" class:show={$current.show} style="--x: {$current.x}px; --y: {$current.y}px;">
  {#each $current.items as item (UUID())}
    {#if item.separator}
      <hr />
    {:else}
      <button
        class="item"
        onclick={() => {
          item.action?.();
          GlobalContextMenuState?.hideMenu();
        }}
      >
        <span>
          {item.caption}
        </span>
        {#if item.active?.()}
          <span class="lucide icon-check"></span>
        {/if}
      </button>
    {/if}
  {/each}
</div>
