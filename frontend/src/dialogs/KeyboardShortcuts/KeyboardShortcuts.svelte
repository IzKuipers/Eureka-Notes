<script>
  import { KeyboardState } from "../../ts/state/keyboard";
</script>

<div class="dialog-body">
  {#each KeyboardState?.accelerators || [] as accelerator (accelerator.display)}
    <div class="accelerator">
      <div class="key">{accelerator.display}</div>
      <div class="description">{accelerator.description}</div>
    </div>
  {/each}
</div>
