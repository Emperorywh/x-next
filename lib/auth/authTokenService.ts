import { SignJWT, jwtVerify } from 'jose'
import EnvironmentConfig from '../config/env'

export class TokenService {

    private static readonly ACCESS_TOKEN_SECRET: Uint8Array = new TextEncoder().encode(EnvironmentConfig.tokenConfig.accessTokenSecret as string);
    private static readonly REFRESH_TOKEN_SECRET: Uint8Array = new TextEncoder().encode(EnvironmentConfig.tokenConfig.refreshTokenSecret as string);
    private static readonly APP_NAME = EnvironmentConfig.appName as string;

    /**
     * 生成访问令牌
     * @param payload 
     */
    static async generateAccessToken(payload: { userId: string }) {
        return new SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime("15m")
            .setIssuer(this.APP_NAME)
            .setAudience(this.APP_NAME)
            .sign(this.ACCESS_TOKEN_SECRET)
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
            .setIssuer(this.APP_NAME)
            .setAudience(this.APP_NAME)
            .sign(this.REFRESH_TOKEN_SECRET)
    }

    /**
     * 验证访问令牌
     * @param token 
     */
    static async verifyAccessToken(token: string) {
        try {
            const { payload } = await jwtVerify(token, this.ACCESS_TOKEN_SECRET, {
                issuer: this.APP_NAME,
                audience: this.APP_NAME,
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
            const { payload } = await jwtVerify(token, this.REFRESH_TOKEN_SECRET, {
                issuer: this.APP_NAME,
                audience: this.APP_NAME,
            });
            return payload;
        } catch {
            return null;
        }
    }
}