<script lang="ts">
  import type { NewNoteShareDialog } from "./NewNoteShare";

  const { dialog }: { dialog: NewNoteShareDialog } = $props();
  const { expiresIn, password } = dialog;
  const HOUR = 1000 * 60 * 60;
  const DAY = HOUR * 24;
</script>

<div class="dialog-body">
  <h1>Share note:</h1>
  <p>Enter the information to create a share for this note:</p>
  <div class="expiry-selector">
    <select bind:value={$expiresIn}>
      <option value="">No expiry</option>
      <option value={HOUR / 2}>30 minutes</option>
      <option value={HOUR}>1 hour</option>
      <option value={HOUR * 4}>4 hours</option>
      <option value={HOUR * 8}>8 hours</option>
      <option value={HOUR * 12}>12 hours</option>
      <option value={DAY}>1 day</option>
      <option value={DAY * 2}>2 days</option>
      <option value={DAY * 5}>5 days</option>
      <option value={DAY * 7}>1 week</option>
      <option value={DAY * 30}>30 days</option>
      <option value={DAY * 365}>1 year</option>
    </select>
    <span class="lucide icon-chevron-down"></span>
  </div>
  <input type="password" placeholder="Password (optional)" bind:value={$password} />
</div>
