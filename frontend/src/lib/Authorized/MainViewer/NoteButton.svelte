<script lang="ts">
  import { NoteIcon } from "../../../ts/images";
  import { GlobalViewerState } from "../../../ts/state/viewer";
  import { GlobalOpenedState } from "../../../ts/state/opened";
  import type { PartialEurekaNote } from "../../../types/note";
  import { contextMenu } from "../../../ts/state/context";
  import { SEP_ITEM } from "../../../types/context";
  import { RenameNoteDialog } from "../../../dialogs/RenameNote/RenameNote";
  import { MoveNotesDialog } from "../../../dialogs/MoveNotes/MoveNotes";

  const { note, i }: { note: PartialEurekaNote; i: number } = $props();
  const { selection, read } = GlobalViewerState!;

  function onclick(e: MouseEvent) {
    if (!e.shiftKey) {
      $selection = [note];
    } else if ($selection.length) {
      console.log($selection);
      const lastSelection = $selection[$selection.length - 1];
      const lastIndex = $read?.notes.findIndex((n) => n._id === lastSelection._id);

      if (lastIndex === undefined || lastIndex < 0) return;

      if (lastIndex < i) {
        for (let j = lastIndex; j <= i; j++) {
          const item = $read?.notes[j];
          console.log(item);
          if (item && !$selection.find((n) => item._id === n._id)) {
            $selection.push(item);
          }
        }
      } else if (lastIndex > i) {
        for (let j = i; j <= lastIndex; j++) {
          const item = $read?.notes[j];
          console.log(item);
          if (item && !$selection.find((n) => item._id === n._id)) {
            $selection.push(item);
          }
        }
      }
    }

    $selection = $selection;
  }
</script>

<button
  class="viewer-item"
  class:selected={$selection.find((n) => n._id === note._id)}
  {onclick}
  ondblclick={() => GlobalOpenedState?.openNote(note)}
  title={note.name}
  use:contextMenu={[
    {
      caption: "Open note",
      action: () => GlobalOpenedState?.openNote(note),
    },
    SEP_ITEM,
    {
      caption: "Rename...",
      action: () => RenameNoteDialog.Invoke(note),
    },
    {
      caption: "Delete this note",
      action: () => GlobalViewerState?.deleteSelection([note]),
    },
    {
      caption: "Move this note...",
      action: () => {
        MoveNotesDialog.Invoke(note);
      },
    },
    SEP_ITEM,
    {
      caption: "Delete selection",
      action: () => GlobalViewerState?.deleteSelection(),
    },
    {
      caption: "Move selection...",
      action: () => {
        MoveNotesDialog.Invoke(...$selection);
      },
    },
  ]}
>
  <img src={NoteIcon} alt="" />
  <span>{note.name}</span>
</button>
