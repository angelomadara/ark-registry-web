import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware runs on Edge — no access to localStorage.
// Auth is handled client-side in each protected page.
// This middleware only handles redirects that don't need auth state.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip internal Next.js and static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
