import { model, Schema } from "mongoose";

export interface EurekaUser {
  username: string;
  passwordHash: string;
  preferences: object;
}

export interface ExistingEurekaUser extends EurekaUser {
  _id: string;
}

const schema = new Schema<EurekaUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    preferences: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export const Users = model<EurekaUser>("users", schema);
