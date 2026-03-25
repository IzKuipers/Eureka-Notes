<script lang="ts">
  import { OpenedState } from "../../ts/state/opened";
  import NoteEditor from "./NoteEditor.svelte";

  const { editors } = OpenedState;
</script>

<div class="opened-editors">
  {#each [...$editors] as [id, editor] (id)}
    <NoteEditor state={editor} />
  {/each}
</div>
