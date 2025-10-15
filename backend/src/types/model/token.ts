import { model, Schema } from "mongoose";

export interface EurekaToken {
  userId: string; // EurekaUser._id
  value: string; // uuid-type token (I'm too lazy for JWT shit right now)
  createdAt?: Date;
}

export interface ExistingEurekaToken extends EurekaToken {
  _id: string;
}

const schema = new Schema<EurekaToken>(
  {
    userId: {
      required: true,
      type: String,
    },
    value: {
      required: true,
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600 * 24, // records expire after 24 hours (3600*24 seconds)
    },
  },
  { timestamps: true }
);

export const Tokens = model<EurekaToken>("tokens", schema);
