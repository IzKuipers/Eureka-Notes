export interface EurekaNote {
  folderId?: string;
  userId: string;
  name: string;
  data: string;
  pinned: boolean;
  conceiled: boolean;
}

export interface ExistingEurekaNote extends EurekaNote {
  _id: string;
  updatedAt: string;
  createdAt: string;
}

export type PartialEurekaNote = Omit<Omit<Omit<ExistingEurekaNote, "data">, "folderId">, "userId">;
export type PartialEurekaNoteWithData = PartialEurekaNote & { data: string };
export type NoteSearchResults = { itemRef: number; item: PartialEurekaNote }[];
