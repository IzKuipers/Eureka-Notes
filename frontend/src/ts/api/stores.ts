import type { UserPreferences } from "../../types/preferences";
import type { ExistingEurekaUser } from "../../types/user";
import { Store } from "../writable";

export const Connected = Store<boolean>(false);
export const LoggedIn = Store<boolean>(false);
export const Preferences = Store<UserPreferences>();
export const UserInfo = Store<ExistingEurekaUser | undefined>();
