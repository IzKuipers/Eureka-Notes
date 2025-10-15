import {
  ExistingEurekaNote,
  Notes,
  PartialEurekaNote,
} from "../../types/model/note";

export async function GetAllNotesOfUser(
  userId: string
): Promise<PartialEurekaNote[]> {
  return await Notes.find<PartialEurekaNote>(
    { userId },
    {
      data: false,
      userId: false,
      folderId: false,
    }
  );
}

export async function GetFullNote(noteId: string) {
  return await Notes.findById<ExistingEurekaNote>(noteId);
}

export async function WriteNote(noteId: string, data: string) {
  return await Notes.updateOne({ _id: noteId }, { data });
}

export async function DeleteNote(noteId: string) {
  return await Notes.findByIdAndDelete(noteId);
}

export async function CreateNote(
  userId: string,
  name: string,
  data: string,
  folderId?: string
) {
  return await Notes.create({ userId, name, data, folderId });
}
