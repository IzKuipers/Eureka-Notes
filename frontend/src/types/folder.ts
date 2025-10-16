import type { PartialEurekaNote } from "./note";

export interface EurekaFolder {
  userId: string;
  parentId?: string;
  name: string;
}

export interface ExistingEurekaFolder extends EurekaFolder {
  _id: string;
  createdAt: string;
  modifiedAt: string;
}

export interface FolderRead {
  folders: ExistingEurekaFolder[];
  notes: PartialEurekaNote[];
  totalSize: number;
  folderId: string;
  folderName: string;
}
