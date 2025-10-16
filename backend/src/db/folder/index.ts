import { join } from "path";
import { ConflictError, NotFoundError } from "../../api/error/classes";
import { ExistingEurekaFolder, FolderRead, Folders } from "../../types/model/folder";
import { DeleteNote, GetAllNotesOfUserWithData } from "../note";
import { Logger } from "../../logging";

export async function GetAllFolders(userId: string) {
  Logger.verbose(`GetAllFolders: ${userId}`);

  return await Folders.find<ExistingEurekaFolder>({ userId });
}

export async function GetAllFoldersOf(userId: string, parentFolderId = "") {
  Logger.verbose(`GetAllFoldersOf: ${userId}, ${parentFolderId}`);

  return await Folders.find<ExistingEurekaFolder>({
    userId,
    parentId: parentFolderId,
  });
}

export async function GetFolderFromPath(userId: string, path?: string): Promise<ExistingEurekaFolder | undefined> {
  Logger.verbose(`GetFolderFromPath: ${userId}, ${path}`);

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
    if (!part) continue;

    const folder = currentFolderContent.filter((f) => f.name === part)[0];

    if (!folder) return currentFolder;

    currentFolder = folder;
    currentFolderContent = allFolders.filter((f) => f.parentId === folder._id);
  }

  return currentFolder;
}

export function GetParentDirectory(path: string) {
  Logger.verbose(`GetParentDirectory: ${path}`);

  if (!path) return "/";

  const pathParts = path.split("/");
  if (pathParts.length === 1) return pathParts[0];
  pathParts.pop();

  return pathParts.join("/");
}

export function GetFolderName(path: string) {
  Logger.verbose(`GetFolderName: ${path}`);

  const pathParts = path.split("/");

  return pathParts[pathParts.length - 1];
}

export async function CreateFolderByPath(userId: string, path: string) {
  if (!path.startsWith("/")) path = `/${path}`;
  Logger.verbose(`CreateFolderByPath: ${userId}, ${path}`);

  const parentPath = GetParentDirectory(path);
  const parent = await ReadFolder(userId, parentPath);
  const name = GetFolderName(path);

  if (!!parent.folders.find((f) => f.name === name)) throw new ConflictError("A folder with that name already exists");

  await Folders.create({
    name: GetFolderName(path),
    userId,
    parentId: parent?.folderId ?? "",
  });
}

export async function ReadFolder(userId: string, path: string = "/"): Promise<FolderRead> {
  Logger.verbose(`ReadFolder: ${userId}, ${path}`);

  const topLevel = await GetFolderFromPath(userId, path);

  if (!topLevel) throw new NotFoundError("Folder not found");

  const childFolders = await GetAllFoldersOf(userId, topLevel._id);
  const childNotes = await GetAllNotesOfUserWithData(userId, topLevel._id);
  const totalSize = childNotes.map((n) => n.data.length).reduce((accumulator, currentValue) => accumulator + currentValue);

  return {
    folders: childFolders,
    notes: childNotes.map((n) => ({ ...(n as any)._doc, data: undefined })),
    totalSize,
    folderId: topLevel._id,
    folderName: topLevel.name,
  };
}

export async function DeleteFolder(userId: string, path: string) {
  Logger.verbose(`deleteFolder: ${userId}, ${path}`);

  const read = await ReadFolder(userId, path);

  for (const folder of read.folders) {
    await DeleteFolder(userId, join(path, folder.name));
  }

  for (const note of read.notes) {
    await DeleteNote(userId, note._id);
  }
}

export async function RenameFolder(userId: string, folderId: string, newName: string) {
  Logger.verbose(`RenameFolder: ${userId}, ${folderId}, ${newName}`);

  return await Folders.updateOne({ userId, _id: folderId }, { name: newName });
}
