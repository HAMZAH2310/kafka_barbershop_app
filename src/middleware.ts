
import { NextRequest, NextResponse } from "next/server";
import { isMobileUserAgent } from "./lib/device";

const PROTECTED_PREFIXES = ["/dashboard", "/customer"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
    const hasToken = request.cookies.has("token");

    if (isProtected && !hasToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const userAgent = request.headers.get("user-agent") || "";
    const isMobile = isMobileUserAgent(userAgent);

    const response = NextResponse.next();
    response.headers.set("x-device-type", isMobile ? "mobile" : "desktop");

    return response;
}

export const config = {
    matcher: "/:path*",
};