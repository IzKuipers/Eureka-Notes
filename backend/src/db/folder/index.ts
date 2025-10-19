import { ConflictError, NotFoundError } from "../../api/error/classes";
import { Logger } from "../../logging";
import { ExistingEurekaFolder, FolderRead, Folders } from "../../types/model/folder";
import { DeleteNote, GetAllNotesOfUserWithData } from "../note";

export async function GetAllFolders(userId: string) {
  Logger.verbose(`GetAllFolders: ${userId}`);

  return await Folders.find<ExistingEurekaFolder>({ userId });
}

export async function GetFolderById(userId: string, folderId: string) {
  if (!folderId)
    return {
      name: "",
      _id: "",
      createdAt: Date.now().toLocaleString(),
      modifiedAt: Date.now().toLocaleString(),
      userId,
    };

  Logger.verbose(`GetFolderById: ${userId}, ${folderId}`);

  return await Folders.findOne<ExistingEurekaFolder>({
    userId: userId.toString(),
    _id: folderId,
  });
}

export async function GetAllFoldersOf(userId: string, parentFolderId = "") {
  Logger.verbose(`GetAllFoldersOf: ${userId}, ${parentFolderId}`);

  return await Folders.find<ExistingEurekaFolder>({
    userId: userId.toString(),
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

    if (!folder) throw new NotFoundError("Folder not found");

    currentFolder = folder;
    currentFolderContent = allFolders.filter((f) => f.parentId === folder._id.toString());
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

export async function ReadFolderById(userId: string, folderId: string = "") {
  if (!folderId) return await ReadFolder(userId);

  Logger.verbose(`ReadFolderById: ${userId}, ${folderId}`);

  const topLevel = await GetFolderById(userId, folderId);

  if (!topLevel) throw new NotFoundError("Folder not found");

  const childFolders = await GetAllFoldersOf(userId, topLevel._id);
  const childNotes = await GetAllNotesOfUserWithData(userId, topLevel._id);
  const totalSize = childNotes.map((n) => n.data.length).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return {
    folders: childFolders,
    notes: childNotes.map((n) => ({ ...(n as any)._doc, data: undefined })),
    totalSize,
    folderId: topLevel._id,
    folderName: topLevel.name,
    parentFolderId: topLevel.parentId,
  };
}

export async function ReadFolder(userId: string, path: string = "/"): Promise<FolderRead> {
  Logger.verbose(`ReadFolder: ${userId}, ${path}`);

  const topLevel = await GetFolderFromPath(userId, path);

  if (!topLevel) throw new NotFoundError("Folder not found");

  const childFolders = await GetAllFoldersOf(userId, topLevel._id);
  const childNotes = (await GetAllNotesOfUserWithData(userId, topLevel._id)).filter((n) =>
    !path || path === "/" ? !n.folderId : true
  );
  const totalSize = childNotes.map((n) => n.data.length).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return {
    folders: childFolders,
    notes: childNotes.map((n) => ({ ...(n as any)._doc, data: undefined })),
    totalSize,
    folderId: topLevel._id,
    folderName: topLevel.name,
    parentFolderId: topLevel.parentId,
  };
}

export async function DeleteFolder(userId: string, id: string) {
  Logger.verbose(`deleteFolder: ${userId}, ${id}`);

  const read = await ReadFolderById(userId, id);

  for (const folder of read.folders) {
    await DeleteFolder(userId, folder._id);
  }

  for (const note of read.notes) {
    await DeleteNote(userId, note._id);
  }

  await Folders.deleteOne({ userId, _id: id });
}

export async function RenameFolder(userId: string, folderId: string, newName: string) {
  Logger.verbose(`RenameFolder: ${userId}, ${folderId}, ${newName}`);

  return await Folders.updateOne({ userId, _id: folderId }, { name: newName });
}
