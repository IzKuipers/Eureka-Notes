<script lang="ts">
    import dayjs from "dayjs";
  import { MoveNotesDialog } from "../../../dialogs/MoveNotes/MoveNotes";
  import { RenameNoteDialog } from "../../../dialogs/RenameNote/RenameNote";
  import { NoteIcon } from "../../../ts/images";
  import { contextMenu } from "../../../ts/state/context";
  import { GlobalOpenedState } from "../../../ts/state/opened";
  import { GlobalViewerState } from "../../../ts/state/viewer";
  import { SEP_ITEM } from "../../../types/context";
  import type { PartialEurekaNote } from "../../../types/note";

  const { note, i }: { note: PartialEurekaNote; i: number } = $props();
  const { selection, read } = GlobalViewerState!;

  function onclick(e: MouseEvent) {
    if (e.ctrlKey) {
      const existingIndex = $selection.findIndex((n) => n._id === note._id);

      if (existingIndex > -1) {
        $selection.splice(existingIndex, 1);
      } else {
        $selection.push(note);
      }
    } else if (e.shiftKey) {
      const lastSelection = $selection[$selection.length - 1];
      const lastIndex = $read?.notes.findIndex((n) => n._id === lastSelection._id);

      if (lastIndex === undefined || lastIndex < 0) return;

      if (lastIndex < i) {
        for (let j = lastIndex; j <= i; j++) {
          const item = $read?.notes[j];

          if (item && !$selection.find((n) => item._id === n._id)) {
            $selection.push(item);
          }
        }
      } else if (lastIndex > i) {
        for (let j = i; j <= lastIndex; j++) {
          const item = $read?.notes[j];

          if (item && !$selection.find((n) => item._id === n._id)) {
            $selection.push(item);
          }
        }
      }
    } else {
      $selection = [note];
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
      caption: "Rename this note",
      action: () => RenameNoteDialog.Invoke(note),
    },
    {
      caption: "Delete...",
      action: () => GlobalViewerState?.deleteSelection(),
    },
    {
      caption: "Move...",
      action: () => {
        MoveNotesDialog.Invoke(...$selection);
      },
    },
    SEP_ITEM,
    {
      caption: "Delete just this note",
      action: () => GlobalViewerState?.deleteSelection([note]),
    },
    {
      caption: "Move just this note",
      action: () => {
        MoveNotesDialog.Invoke(note);
      },
    },
  ]}
>
  <img src={NoteIcon} alt="" />
  <span>{note.name}</span>
  <span class="timestamp">{dayjs(note.updatedAt).format("DD/MM/YYYY H:mm")}</span>
  <span class="timestamp">{dayjs(note.createdAt).format("DD/MM/YYYY H:mm")}</span>
</button>
