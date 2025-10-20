import EnvironmentConfig from '@/lib/config/env';
import { SignJWT, jwtVerify } from 'jose'

export class JWTService {

    private static getAccessTokenSecret(): Uint8Array {
        const secret = EnvironmentConfig.tokenConfig.accessTokenSecret as string;
        if (!secret) {
            throw new Error('ACCESS_TOKEN_SECRET environment variable is not set');
        }
        return new TextEncoder().encode(secret);
    }

    private static getRefreshTokenSecret(): Uint8Array {
        const secret = EnvironmentConfig.tokenConfig.refreshTokenSecret as string;
        if (!secret) {
            throw new Error('REFRESH_TOKEN_SECRET environment variable is not set');
        }
        return new TextEncoder().encode(secret);
    }

    private static getAppName(): string {
        const appName = EnvironmentConfig.appName as string;
        if (!appName) {
            throw new Error('APP_NAME environment variable is not set');
        }
        return appName;
    }

    /**
     * 生成访问令牌
     * @param payload 
     */
    static async generateAccessToken(payload: { userId: string }) {
        return new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime("1h")
            .setIssuer(this.getAppName())
            .setAudience(this.getAppName())
            .sign(this.getAccessTokenSecret())
    }


    /**
     * 生成刷新令牌
     * @param payload 
     */
    static async generateRefreshToken(payload: { userId: string }) {
        return new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime("7d")
            .setIssuer(this.getAppName())
            .setAudience(this.getAppName())
            .sign(this.getRefreshTokenSecret())
    }

    /**
     * 验证访问令牌
     * @param token 
     */
    static async verifyAccessToken(token: string) {
        try {
            const { payload } = await jwtVerify(token, this.getAccessTokenSecret(), {
                issuer: this.getAppName(),
                audience: this.getAppName(),
            });
            return payload;
        } catch {
            return null;
        }
    }

    /**
     * 验证刷新令牌
     * @param token 
     */
    static async verifyRefreshToken(token: string) {
        try {
            const { payload } = await jwtVerify(token, this.getRefreshTokenSecret(), {
                issuer: this.getAppName(),
                audience: this.getAppName(),
            });
            return payload;
        } catch {
            return null;
        }
    }
}