import { model, Schema } from "mongoose";

export interface EurekaNote {
  folderId?: string;
  userId: string;
  name: string;
  data: string;
}

export interface ExistingEurekaNote extends EurekaNote {
  _id: string;
  modifiedAt: string;
  createdAt: string;
}

export type PartialEurekaNote = Omit<Omit<Omit<ExistingEurekaNote, "data">, "folderId">, "userId">;

export type PartialEurekaNoteWithData = PartialEurekaNote & { data: string; folderId?: string };

const schema = new Schema<EurekaNote>(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    folderId: {
      type: String,
      default: "",
    },
    data: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Notes = model<EurekaNote>("notes", schema);
