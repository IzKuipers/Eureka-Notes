import { join } from "path";
import { NotFoundError } from "../../api/error";
import {
  ExistingEurekaFolder,
  FolderRead,
  Folders,
} from "../../types/model/folder";
import { DeleteNote, GetAllNotesOfUserWithData } from "../note";

export async function GetAllFolders(userId: string) {
  return await Folders.find<ExistingEurekaFolder>({ userId });
}

export async function GetAllFoldersOf(userId: string, parentFolderId = "") {
  return await Folders.find<ExistingEurekaFolder>({
    userId,
    parentId: parentFolderId,
  });
}

export async function GetFolderFromPath(
  userId: string,
  path?: string
): Promise<ExistingEurekaFolder | undefined> {
  if (!path || path === "/")
    return {
      name: "",
      _id: "",
      createdAt: Date.now().toLocaleString(),
      modifiedAt: Date.now().toLocaleString(),
      userId,
    };

  const pathParts = path.split("/");
  const allFolders = await GetAllFolders(userId);
  let currentFolderContent: ExistingEurekaFolder[] = allFolders;
  let currentFolder: ExistingEurekaFolder | undefined;

  for (const part of pathParts) {
    const folder = currentFolderContent.filter((f) => f.name === part)[0];

    if (!folder) return currentFolder;

    currentFolder = folder;
    currentFolderContent = allFolders.filter((f) => f.parentId === folder._id);
  }

  return currentFolder;
}

export function GetParentDirectory(path: string) {
  if (!path) return "/";

  const pathParts = path.split("/");
  if (pathParts.length === 1) return pathParts[0];
  pathParts.pop();

  return pathParts.join("/");
}

export function GetFolderName(path: string) {
  const pathParts = path.split("/");

  return pathParts[pathParts.length - 1];
}

export async function CreateFolderByPath(userId: string, path: string) {
  const parentPath = GetParentDirectory(path);
  const parent = await GetFolderFromPath(userId, parentPath);

  await Folders.create({
    name: GetFolderName(path),
    userId,
    parentId: parent?.parentId ?? "",
  });
}

export async function ReadFolder(
  userId: string,
  path: string = "/"
): Promise<FolderRead> {
  const topLevel = await GetFolderFromPath(userId, path);

  if (!topLevel) throw new NotFoundError("Folder not found");

  const childFolders = await GetAllFoldersOf(userId, topLevel._id);
  const childNotes = await GetAllNotesOfUserWithData(userId, topLevel._id);
  const totalSize = childNotes
    .map((n) => n.data.length)
    .reduce((accumulator, currentValue) => accumulator + currentValue);

  return {
    folders: childFolders,
    notes: childNotes.map((n) => ({ ...(n as any)._doc, data: undefined })),
    totalSize,
    folderId: topLevel._id,
    folderName: topLevel.name
  };
}

export async function DeleteFolder(userId: string, path: string) {
  const read = await ReadFolder(userId, path);

  for (const folder of read.folders) {
    await DeleteFolder(userId, join(path, folder.name));
  }

  for (const note of read.notes) {
    await DeleteNote(userId, note._id);
  }
}
