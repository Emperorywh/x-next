/**
 * 发送验证码返回值
 */
export interface SendVerificationCodeRespnse {
    message: string;
    expiresIn: number;
}