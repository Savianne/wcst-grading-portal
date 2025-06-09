// export { default } from "next-auth/middleware"
// export const config = {
//     matcher: ['/admin/:path*']
// }

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const { pathname } = req.nextUrl;

    // Redirect to login if not authenticated
    if (!token) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = "/login";
        return NextResponse.redirect(loginUrl);
    }

    // Role-based protection
    const role = token.accountType;

    // /admin pages require admin
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
        const unauthorizedUrl = req.nextUrl.clone();
        unauthorizedUrl.pathname = "/unauthorized";
        return NextResponse.redirect(unauthorizedUrl);
    }

    // /teacher pages require teacher
    if (pathname.startsWith("/teacher") && role !== "TEACHER") {
        const unauthorizedUrl = req.nextUrl.clone();
        unauthorizedUrl.pathname = "/unauthorized";
        return NextResponse.redirect(unauthorizedUrl);
    }

    // /student pages require student
    if (pathname.startsWith("/student") && role !== "STUDENT") {
        const unauthorizedUrl = req.nextUrl.clone();
        unauthorizedUrl.pathname = "/unauthorized";
        return NextResponse.redirect(unauthorizedUrl);
    }

    // Allow request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"],
};
