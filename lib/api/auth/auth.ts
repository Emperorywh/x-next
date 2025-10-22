// lib/auth/server-auth.ts
import { cookies, headers } from 'next/headers';
import { JWTService } from '@/lib/api/jwt/jwt.service';
import { redirect } from 'next/navigation';

export async function getAuthenticatedUser() {
    // 优先从 proxy 设置的 header 中获取（已验证过的）
    const headersList = await headers();
    const userIdFromHeader = headersList.get('x-user-id');

    if (userIdFromHeader) {
        return {
            authenticated: true,
            userId: userIdFromHeader,
            error: null
        };
    }

    // 如果 header 中没有，说明 proxy 没有验证通过，再次验证
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return {
            authenticated: false,
            userId: null,
            error: '未提供认证令牌',
            code: 401
        };
    }

    const payload = await JWTService.verifyAccessToken(accessToken);

    if (!payload) {
        return {
            authenticated: false,
            userId: null,
            error: '认证令牌无效或已过期',
            code: 401
        };
    }

    return {
        authenticated: true,
        userId: payload.userId as string,
        error: null
    };
}

export function withAuth<TArgs extends any[], TReturn>(
    action: (...args: TArgs) => Promise<TReturn>
) {
    return async (...args: TArgs): Promise<TReturn> => {
        // 鉴权检查（在最外层，不会被 action 内部的 try-catch 捕获）
        const auth = await getAuthenticatedUser();
        if (!auth.authenticated) {
            redirect('/login');
        }

        // 执行原始 action
        return action(...args);
    };
}