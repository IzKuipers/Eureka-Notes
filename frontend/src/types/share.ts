export interface EurekaShare {
  _id: string;
  userId: string; // -> EurekaUser._id
  noteId: string; // -> EurekaNote._id
  password?: string;
  timesUsed?: number;
  expiresAt?: number;
  value: string;
}

export interface ShareReadResponse {
  username: string;
  noteName: string;
  folderName: string;
  updatedAt: string;
  data: string;
  //
  shareExpiresAt: number;
}

export interface ShareListItem {
  noteName: string;
  timesUsed: number;
  _id: string;
  expiresAt: number;
  value: string;
  password?: string;
}
