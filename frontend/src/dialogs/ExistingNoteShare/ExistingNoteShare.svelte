<script lang="ts">
  import dayjs from "dayjs";
  import type { ExistingNoteShareDialog } from "./ExistingNoteShare";
  import CenterLoader from "../../lib/CenterLoader.svelte";

  const { dialog }: { dialog: ExistingNoteShareDialog } = $props();
  const { shareInfo, loading } = dialog;
</script>

<div class="dialog-body">
  {#if !$loading}
    <h1>Share note</h1>
    <p>This note has the following share information:</p>
    <div class="information">
      <div class="item expires">
        <div class="key">Expires on:</div>
        <div class="value">
          {($shareInfo?.expiresAt ?? -1) > 0 ? dayjs($shareInfo?.expiresAt).format("MMMM DD YYYY, HH:mm") : "Never expires"}
        </div>
      </div>
      <div class="item password">
        <div class="key">Password:</div>
        <div class="value">
          <div class="password">
            {$shareInfo?.password ? "*".repeat($shareInfo.password.length) : "No password"}
          </div>
          <button
            class="copy"
            disabled={!$shareInfo?.password}
            onclick={() => navigator.clipboard.writeText($shareInfo?.password ?? "")}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  {:else}
    <CenterLoader />
  {/if}
</div>
