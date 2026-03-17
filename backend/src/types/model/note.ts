import { model, Schema } from "mongoose";

export interface EurekaNote {
  folderId?: string;
  userId: string;
  name: string;
  data: string;
  conceiled: boolean;
  pinned: boolean;
}

export interface ExistingEurekaNote extends EurekaNote {
  _id: string;
  updatedAt: string;
  createdAt: string;
}

export type PartialEurekaNote = Omit<Omit<ExistingEurekaNote, "data">, "userId">;

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
    conceiled: {
      type: Boolean,
      default: false,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Notes = model<EurekaNote>("notes", schema);
