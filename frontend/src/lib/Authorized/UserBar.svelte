<script lang="ts">
  import { GlobalServerConnector } from "../../ts/api";
  import { UserInfo } from "../../ts/api/stores";
  import { ShowDialog } from "../../ts/dialog";
  import { GlobalViewerState } from "../../ts/state";

  const { path } = GlobalViewerState!;

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
  <div class="account-area">
    <p class="username">{$UserInfo?.username}</p>
    <button class="lucide icon-log-out" aria-label="Log out" onclick={logout}></button>
  </div>
</div>
