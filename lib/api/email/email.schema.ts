import z from "zod";

/**
 * 发送邮件验证码Schema
 */
export const sendVerificationCodeSchema = z.object({
    email: z.string().email("邮箱格式错误"),
    type: z.enum(['register', 'login', 'reset-password']).optional().default('register')
});

/**
 * 发送邮件验证码Dto
 */
export type SendCodeVerificationCodeDto = z.infer<typeof sendVerificationCodeSchema>;