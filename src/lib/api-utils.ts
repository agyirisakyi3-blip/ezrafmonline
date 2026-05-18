import { NextResponse } from "next/server";

const noCacheHeaders: Record<string, string> = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export function jsonResponse<T>(data: T, init?: ResponseInit): NextResponse<T> {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...noCacheHeaders,
      "X-Content-Type-Options": "nosniff",
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
}
