import type { NextResponse } from "next/server";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  expiresAt: Date,
): void {
  response.cookies.set("pp_access_token", accessToken, {
    ...cookieOptions,
    expires: expiresAt,
  });
  response.cookies.set("pp_refresh_token", refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set("pp_access_token", "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set("pp_refresh_token", "", { ...cookieOptions, maxAge: 0 });
}
