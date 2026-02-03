import { model, Schema } from "mongoose";

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

const schema = new Schema<EurekaShare>({
  userId: {
    type: String,
    required: true,
  },
  noteId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    default: "",
  },
  timesUsed: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Number,
    default: -1, // -1 = no expiry
  },
  value: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Shares = model<EurekaShare>("share", schema);
