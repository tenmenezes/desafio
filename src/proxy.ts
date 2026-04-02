import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const token = request.cookies.get("token")?.value;

    let isAuthenticated = false;

    if (token) {
        try {
            verifyToken(token);
            isAuthenticated = true;
        } catch {
            isAuthenticated = false;
        }
    }

    if (isProtectedRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isPublicRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};