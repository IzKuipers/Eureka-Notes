import type { UserPreferences } from "./preferences";

export interface EurekaUser {
  username: string;
  passwordHash: string;
  preferences: UserPreferences;
}

export interface ExistingEurekaUser extends EurekaUser {
  _id: string;
}
