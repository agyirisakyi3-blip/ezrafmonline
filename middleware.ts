import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname === "/cms/login";

  const hasSession = !!(
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value
  );

  if (isLoginPage && hasSession) {
    return NextResponse.redirect(new URL("/cms", req.url));
  }

  if (!isLoginPage && !hasSession) {
    return NextResponse.redirect(new URL("/cms/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms/:path*"],
};
