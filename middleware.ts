// middleware.ts 增强版
import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "./lib/auth/authTokenService";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    // 公开路由（不需要 token）
    const publicRoutes = [
        '/',
        '/api/auth/login',
        '/api/auth/register',
        '/api/email/send-verification-code',
        '/login',
        '/register'
    ];

    // 检查是否为公开路由
    if (publicRoutes.some(route => pathname === route)) {
        return NextResponse.next();
    }

    // API 路由需要 token 校验
    if (pathname.startsWith('/api/')) {
        return await validateApiToken(request);
    }

    // 页面路由需要 token 校验
    return await validatePageToken(request);
}

async function validateApiToken(request: NextRequest) {
    const authorization = request.headers.get('authorization');

    if (!authorization) {
        return NextResponse.json(
            { success: false, message: '未提供认证令牌' },
            { status: 401 }
        );
    }

    const token = authorization.replace('Bearer ', '');
    const payload = await TokenService.verifyAccessToken(token);

    if (!payload) {
        return NextResponse.json(
            { success: false, message: '认证令牌无效或已过期' },
            { status: 401 }
        );
    }

    // 将用户信息添加到请求头，供 API 路由使用
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId as string);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

async function validatePageToken(request: NextRequest) {
    const authorization = request.headers.get('authorization');

    if (!authorization) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const token = authorization.replace('Bearer ', '');
    const payload = await TokenService.verifyAccessToken(token);

    if (!payload) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};