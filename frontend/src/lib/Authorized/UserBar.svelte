<script lang="ts">
  import { GlobalServerConnector } from "../../ts/api";
  import { UserInfo } from "../../ts/api/stores";
  import { ShowDialog } from "../../ts/dialog";
  import { GlobalViewerState } from "../../ts/state/viewer";

  const { path, selection } = GlobalViewerState!;

  async function logout() {
    ShowDialog({
      title: "Log out?",
      message: "Are you sure you want to log out?",
      buttons: [
        { caption: "Cancel" },
        {
          caption: "Log out",
          className: "red",
          action: async () => {
            await GlobalServerConnector?.logout(); // await this to hide the dialog at the right moment
          },
        },
      ],
    });
  }
</script>

<div class="user-bar">
  <div class="path">{$path || "/"}</div>
  <div class="selection-actions">
    {#if $selection.length === 1}
      <button class="lucide icon-text-cursor-input" aria-label="Rename note" onclick={() => GlobalViewerState?.renameSelection()}
      ></button>
    {/if}
    {#if $selection.length}
      <button class="lucide icon-trash" aria-label="Delete note(s)" onclick={() => GlobalViewerState?.deleteSelection()}></button>
      <button class="lucide icon-folder-output" aria-label="Move note(s)" onclick={() => GlobalViewerState?.moveSelection()}
      ></button>
    {/if}
  </div>
  <div class="account-area">
    <p class="username">{$UserInfo?.username}</p>
    <button class="lucide icon-log-out" aria-label="Log out" onclick={logout}></button>
  </div>
</div>
