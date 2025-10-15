import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "./lib/auth/authTokenService";

/**
 * 中间件
 * @param request 
 */
export async function middleware(request: NextRequest) {
    const authorization = request.headers.get('authorization');

    const publicRoutes = ['/', '/login'];
    if (publicRoutes.includes(request.nextUrl.pathname)) {
        return NextResponse.next()
    }
    if (!authorization) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    const token = authorization.replace('Bearer ', '');

    const payload = await TokenService.verifyAccessToken(token);
    if (!payload) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}