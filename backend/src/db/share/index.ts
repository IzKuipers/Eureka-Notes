import { randomUUID } from "crypto";
import { NotFoundError } from "../../api/error/classes";
import { CommandResult } from "../../result";
import { EurekaShare, ShareListItem, ShareReadResponse, Shares } from "../../types/model/share";
import { GetFolderById } from "../folder";
import { GetAllNotesOfUser, GetFullNote } from "../note";
import { GetUserById } from "../user";
import { AuthorizationError } from "../../api/auth";

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

export async function GetNoteByShareValue(value: string, password?: string): Promise<CommandResult<ShareReadResponse>> {
  const existing = await Shares.findOne<EurekaShare>({ value });

  if (!existing) {
    return CommandResult.Error<ShareReadResponse>("The share could not be found.", NotFoundError);
  }

  if (existing.password && password !== existing.password) {
    return CommandResult.Error<ShareReadResponse>("The supplied password is incorrect.", AuthorizationError);
  }

  // check share node expiry
  const expiresAt = existing?.expiresAt ?? -1;

  if (expiresAt > 0 && Date.now() > expiresAt) {
    await DeleteShareNode(existing._id.toString());

    return CommandResult.Error<ShareReadResponse>(
      "This share has expired. Please ask the owner for a new share.",
      AuthorizationError,
    );
  }

  const note = await GetFullNote(existing.userId, existing.noteId);

  if (!note) {
    return CommandResult.Error<ShareReadResponse>("The note associated with this share could not be found.", NotFoundError);
  }

  // Increment timesUsed
  await Shares.updateOne({ _id: existing._id.toString() }, { timesUsed: (existing.timesUsed ?? 0) + 1 });

  const user = await GetUserById(existing.userId);
  const folder = note.folderId ? await GetFolderById(existing.userId, note.folderId) : undefined;

  return CommandResult.Ok<ShareReadResponse>({
    data: note.data,
    noteName: note.name,
    username: user?.username ?? "Stranger",
    folderName: folder?.name || "/",
    shareExpiresAt: existing.expiresAt!,
    updatedAt: note.updatedAt,
  });
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
    password: s.password,
  }));
}

export async function GetUserShareNodes(userId: string): Promise<ShareListItem[]> {
  const shares = await Shares.find({ userId });
  const notes = await GetAllNotesOfUser(userId);

  return shares.map((s) => ({
    noteName: notes.find((n) => n._id.toString() === s.noteId)?.name ?? "Unknown note",
    timesUsed: s.timesUsed ?? 0,
    _id: s._id.toString(),
    expiresAt: s.expiresAt || -1,
    value: s.value,
    password: s.password,
  }));
}
