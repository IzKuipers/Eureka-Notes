import { verify } from "argon2";
import { randomUUID } from "crypto";
import { ExistingEurekaToken, Tokens } from "../../types/model/token";
import { ExistingEurekaUser } from "../../types/model/user";
import { GetUserById, GetUserByUsername } from "../user";
import { Logger } from "../../logging";
import { AuthorizationError } from "../../api/auth";

export async function GenerateToken(userId: string) {
  Logger.verbose(`GenerateToken: ${userId}`);

  const uuid = randomUUID();

  await Tokens.create({
    value: uuid,
    userId,
  });

  return uuid;
}

export async function ValidateToken(value: string): Promise<ExistingEurekaUser | null> {
  Logger.verbose(`ValidateToken: ${value}`);

  const tokenData = await Tokens.findOne<ExistingEurekaToken>({ value });
  if (!tokenData) return null;

  await Tokens.updateOne({ _id: tokenData._id.toString() }, { createdAt: Date.now() }); // Refresh the token

  return await GetUserById(tokenData?.userId!);
}

export async function InvalidateTokenByValue(value: string): Promise<boolean> {
  Logger.verbose(`InvalidateTokenByValue: ${value}`);

  const result = await Tokens.deleteOne({ value });

  return !!result;
}

export async function AuthenticateUser(username: string, password: string): Promise<string | undefined> {
  Logger.verbose(`AuthenticateUser: ${username}, ************`);

  const user = await GetUserByUsername(username);
  if (!user) throw new AuthorizationError("Username or password incorrect");

  const passwordValid = await verify(user.passwordHash, password);
  if (!passwordValid) throw new AuthorizationError("Username or password incorrect");

  return await GenerateToken(user._id);
}
