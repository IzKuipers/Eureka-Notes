import { model, Schema } from "mongoose";

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

const schema = new Schema<EurekaFolder>({
  userId: {
    type: String,
    required: true,
  },
  parentId: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
});

export const Folders = model("folders", schema);
