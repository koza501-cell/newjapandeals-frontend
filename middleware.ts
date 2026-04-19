import { NextRequest, NextResponse } from "next/server";

/**
 * 301-redirect any URL containing the "cheif" typo to the corrected "chief" path.
 * Covers product slugs such as /product/seiko-master-cheif-... generated from bad DB data.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/cheif/i.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/cheif/gi, "chief");
    return NextResponse.redirect(url, { status: 301 });
  }
}

export const config = {
  matcher: ["/product/:path*", "/brand/:path*"],
};
