<script>
  import { GlobalKeyboardState } from "../../ts/state/keyboard";
</script>

<div class="dialog-body">
  {#each GlobalKeyboardState?.accelerators || [] as accelerator (accelerator.display)}
    <div class="accelerator">
      <div class="key">{accelerator.display}</div>
      <div class="description">{accelerator.description}</div>
    </div>
  {/each}
</div>
