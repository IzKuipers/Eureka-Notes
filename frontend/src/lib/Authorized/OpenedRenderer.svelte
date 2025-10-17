<script lang="ts">
  import { GlobalOpenedState } from "../../ts/state/opened";
  import NoteEditor from "./NoteEditor.svelte";

  const { editors } = GlobalOpenedState!;
</script>

<div class="opened-editors">
  {#each [...$editors] as [id, editor] (id)}
    <NoteEditor state={editor} />
  {/each}
</div>
