// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { JWTService } from "./lib/api/jwt/jwt.service";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 公开路由（不需要 token）
    const publicRoutes = [
        '/',
        '/api/user/login',
        '/api/user/register',
        '/api/email/send-verification-code',
        '/login',
        '/register'
    ];

    // 检查是否为公开路由
    if (publicRoutes.some(route => pathname === route)) {
        return NextResponse.next();
    }

    // 检测是否为 Server Action 请求
    const isServerAction = request.headers.get('Next-Action') !== null ||
        request.headers.get('Next-Router-State-Tree') !== null;

    // API 路由需要 token 校验
    if (pathname.startsWith('/api/')) {
        return await validateApiToken(request);
    }

    // 页面路由和 Server Actions 需要 token 校验
    return await validatePageToken(request, isServerAction);
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
    const payload = await JWTService.verifyAccessToken(token);

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

async function validatePageToken(request: NextRequest, isServerAction: boolean) {
    // 1. 从 Cookie 获取 accessToken
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
        // 如果是 Server Action 请求，让它通过，在 Action 内部处理
        if (isServerAction) {
            return NextResponse.next();
        }
        // 普通页面请求则重定向
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. 验证 accessToken
    const payload = await JWTService.verifyAccessToken(accessToken);

    if (payload) {
        // Token 有效，将用户信息添加到请求头
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.userId as string);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }


    // 如果是 Server Action 请求，让它通过，在 Action 内部处理
    if (isServerAction) {
        return NextResponse.next();
    }

    // 普通页面请求则重定向到登录页
    return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};