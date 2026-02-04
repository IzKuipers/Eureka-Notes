import { randomUUID } from "crypto";
import { EurekaShare, ShareListItem, ShareReadResponse, Shares } from "../../types/model/share";
import { GetFolderById } from "../folder";
import { GetAllNotesOfUser, GetFullNote } from "../note";
import { GetUserById } from "../user";

export async function CreateShareNode(userId: string, noteId: string, password?: string, expiresIn?: number) {
  const value = randomUUID();

  return await Shares.create({
    userId,
    noteId,
    password,
    expiresAt: expiresIn ? Date.now() + expiresIn : -1,
    value,
  });
}

export async function GetNoteByShareValue(value: string): Promise<ShareReadResponse | undefined> {
  const existing = await Shares.findOne<EurekaShare>({ value });
  if (!existing) return undefined;

  // check share node expiry
  const expiresAt = existing?.expiresAt ?? -1;

  if (expiresAt > 0 && Date.now() > expiresAt) {
    await DeleteShareNode(existing._id.toString());
    return undefined;
  }

  const note = await GetFullNote(existing.userId, existing.noteId);
  if (!note) return undefined;

  const user = await GetUserById(existing.userId);
  const folder = note.folderId ? await GetFolderById(existing.userId, note.folderId) : undefined;

  return {
    data: note.data,
    noteName: note.name,
    username: user?.username ?? "Stranger",
    folderName: folder?.name || "/",
    shareExpiresAt: existing.expiresAt!,
    updatedAt: note.updatedAt,
  };
}

export async function GetShareById(userId: string, shareId: string): Promise<EurekaShare | undefined> {
  return (await Shares.findOne<EurekaShare>({ userId, _id: shareId })) ?? undefined;
}

export async function DeleteShareNode(shareId: string) {
  return await Shares.deleteOne({ _id: shareId });
}

export async function GetNoteShareNodes(userId: string, noteId: string): Promise<ShareListItem[]> {
  const shares = await Shares.find({ userId, noteId });
  const note = await GetFullNote(userId, noteId);

  return shares.map((s) => ({
    noteName: note?.name ?? "Unknown note",
    timesUsed: s.timesUsed ?? 0,
    _id: s._id.toString(),
    expiresAt: s.expiresAt || -1,
    value: s.value,
  }));
}

export async function GetUserShareNodes(userId: string) {
  const shares = await Shares.find({ userId });
  const notes = await GetAllNotesOfUser(userId);

  return shares.map((s) => ({
    noteName: notes.find((n) => n._id.toString() === s.noteId)?.name ?? "Unknown note",
    timesUsed: s.timesUsed ?? 0,
    _id: s._id.toString(),
    expiresAt: s.expiresAt || -1,
    value: s.value,
  }));
}
