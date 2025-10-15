import { ExistingEurekaUser, Users } from "../../types/model/user";
import { HashPassword, NormalizeUsername } from "./util";

export async function GetUserByUsername(
  username: string
): Promise<ExistingEurekaUser | undefined> {
  return (
    (await Users.findOne<ExistingEurekaUser>({
      username: NormalizeUsername(username),
    })) ?? undefined
  );
}

export async function GetUserById(userId: string) {
  return await Users.findById<ExistingEurekaUser>(userId);
}

export async function CreateUser(username: string, password: string) {
  const existingUser = await GetUserByUsername(username);

  if (existingUser) throw new Error("User already exists");

  const passwordHash = await HashPassword(password);

  await Users.create({
    username: NormalizeUsername(username),
    passwordHash,
  });
}

export async function DeleteUser(userId: string) {
  return await Users.findByIdAndDelete(userId);
}

export async function GetUserPreferences(userId: string) {
  return (await Users.findById(userId))?.preferences;
}

export async function SetUserPreferences(userId: string, preferences: object) {
  return await Users.findByIdAndUpdate(userId, { preferences });
}
