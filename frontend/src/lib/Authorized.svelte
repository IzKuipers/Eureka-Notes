<script lang="ts">
  import { onMount } from "svelte";
  import { GlobalServerConnector } from "../ts/api";
  import { UserInfo } from "../ts/api/stores";
  import { Store } from "../ts/writable";
  import type { FolderRead } from "../types/folder";

  let Path = Store<string>("");
  let content = $state<FolderRead>();

  async function refresh() {
    content = await GlobalServerConnector?.readFolder($Path);
  }

  async function navigate(path: string) {
    $Path = path;
    await refresh();
  }

  onMount(() => {
    refresh();
  });
</script>

{#each content?.folders as folder (folder._id)}
  <button onclick={() => navigate(`${$Path}/${folder.name}`)}>{folder.name}</button>
{/each}

{#each content?.notes as note (note._id)}
  <button onclick={() => console.log(note)}>{note.name}</button>
{/each}
