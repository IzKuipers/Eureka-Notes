<script lang="ts">
    import { ServerConnector } from "../../ts/api";
  import { UserInfo } from "../../ts/api/stores";
  import { ShowDialog } from "../../ts/dialog";
    import { ViewerState } from "../../ts/state/viewer";

  const { path, selection } = ViewerState!;

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
            await ServerConnector?.logout(); // await this to hide the dialog at the right moment
          },
          autofocus: true,
        },
      ],
    });
  }
</script>

<div class="user-bar">
  <div class="path">{$path || "/"}</div>
  <div class="selection-actions">
    {#if $selection.length === 1}
      <button class="lucide icon-text-cursor-input" aria-label="Rename note" onclick={() => ViewerState?.renameSelection()}
      ></button>
    {/if}
    {#if $selection.length}
      <button class="lucide icon-trash" aria-label="Delete note(s)" onclick={() => ViewerState?.deleteSelection()}></button>
      <button class="lucide icon-folder-output" aria-label="Move note(s)" onclick={() => ViewerState?.moveSelection()}
      ></button>
    {/if}
  </div>
  <div class="account-area">
    <p class="username">{$UserInfo?.username}</p>
    <button class="lucide icon-log-out" aria-label="Log out" onclick={logout}></button>
  </div>
</div>
