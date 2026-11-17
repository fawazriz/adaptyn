import type { CookieOptions } from "express";

const secure = process.env.NODE_ENV === "production";

export const sessionCookieName = secure ? "__Host-adaptyn-session" : "adaptyn-session";
export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure,
  sameSite: "lax",
  path: "/",
};
