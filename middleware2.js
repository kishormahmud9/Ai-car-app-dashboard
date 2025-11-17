// middleware.js (root এ রাখুন)
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/api/auth",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/about",
  "/terms",
  "/privacy",
];

function isPublicPath(pathname) {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p))) return true;
  if (pathname.startsWith("/_next") || pathname.startsWith("/assets") || pathname.startsWith("/images")) return true;
  // স্ট্যাটিক ফাইল (যেকোনো এক্সটেনশন) – পাবলিক ধরা
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) return true;
  return false;
}

function hasSessionCookie(req) {
  return Boolean(
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token") ||
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-authjs.session-token")
  );
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Public → pass through
  if (isPublicPath(pathname)) return NextResponse.next();

  // কোন রুটগুলো প্রোটেক্টেড
  const isProtected =
    pathname === "/dashboard" ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/agent") ||
    pathname.startsWith("/listings") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/verification") ||
    pathname.startsWith("/notifications");

  if (!isProtected) return NextResponse.next();

  // 1) JWT/NextAuth টোকেন চেক (Auth.js/NextAuth v4/v5)
  const token = await getToken({ req, secureCookie: true }); // ENV অনুযায়ী secureCookie ঠিক থাকে
  // 2) Cookie fallback (DB sessions হলে)
  const cookieHasSession = hasSessionCookie(req);

  const isLoggedIn = Boolean(token || cookieHasSession);

  if (!isLoggedIn) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirect", pathname || "/dashboard");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// স্ট্যাটিক/ইমেজ/api/auth বাদ দিয়ে বাকিতে middleware চালান
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api/auth|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
