import { NotFoundError } from "../../api/error";
import {
  ExistingEurekaNote,
  Notes,
  PartialEurekaNote,
  PartialEurekaNoteWithData,
} from "../../types/model/note";
import { GetFolderFromPath } from "../folder";

export async function GetAllNotesOfUser(
  userId: string,
  folderId?: string
): Promise<PartialEurekaNote[]> {
  return await Notes.find<PartialEurekaNote>(
    folderId ? { userId, folderId } : { userId },
    {
      data: false,
      userId: false,
      folderId: false,
    }
  );
}

export async function GetAllNotesOfUserWithData(
  userId: string,
  folderId?: string
): Promise<PartialEurekaNoteWithData[]> {
  return await Notes.find<PartialEurekaNoteWithData>(
    folderId ? { userId, folderId } : { userId },
    {
      userId: false,
      folderId: false,
    }
  );
}
export async function GetNotesByPath(userId: string, path: string) {
  const folder = await GetFolderFromPath(userId, path);

  if (!folder) throw new NotFoundError("Folder not found.");

  return await GetAllNotesOfUser(userId, folder._id);
}

export async function GetFullNote(userId: string, noteId: string) {
  return await Notes.findOne<ExistingEurekaNote>({ userId, _id: noteId });
}

export async function WriteNote(userId: string, noteId: string, data: string) {
  return await Notes.updateOne({ userId, _id: noteId }, { data });
}

export async function DeleteNote(userId: string, noteId: string) {
  return await Notes.deleteOne({ userId, _id: noteId });
}

export async function CreateNote(
  userId: string,
  name: string,
  data: string,
  folderId?: string
) {
  return await Notes.create({ userId, name, data, folderId });
}

export async function RenameNote(
  userId: string,
  noteId: string,
  newName: string
) {
  return await Notes.updateOne({ userId, _id: noteId }, { name: newName });
}

export async function GetNoteByName(
  userId: string,
  name: string,
  folderId?: string
) {
  return await Notes.findOne({ userId, name, folderId });
}
