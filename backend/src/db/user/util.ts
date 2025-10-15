import argon2 from "argon2";

export async function HashPassword(password: string) {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 2,
    hashLength: 16,
  });
}

export function NormalizeUsername(username: string) {
  return username.toLowerCase().trim();
}
