import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const cookieName = process.env.NODE_ENV === "production" ? "__Host-adaptyn-session" : "adaptyn-session";
  const cookie = request.cookies.get(cookieName);

  if (cookie?.value) {
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    try {
      const session = await fetch(new URL("/api/auth/session", apiUrl), {
        headers: { Cookie: `${cookie.name}=${encodeURIComponent(cookie.value)}` },
        cache: "no-store",
        redirect: "error",
      });
      if (session.status === 204) {
        return NextResponse.next({ headers: { "Cache-Control": "private, no-store" } });
      }
      if (session.status !== 401) {
        return new NextResponse("Authentication service unavailable", { status: 503 });
      }
    } catch {
      return new NextResponse("Authentication service unavailable", { status: 503 });
    }
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
