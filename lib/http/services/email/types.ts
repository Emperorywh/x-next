/**
 * 邮件模块 - 类型定义
 */

/**
 * 发送验证码请求
 */
export interface SendVerificationCodeRequest {
	email: string;
}

/**
 * 发送验证码响应
 */
export interface SendVerificationCodeResponse {
	success: boolean;
	message: string;
	expiresIn: number;
}


/**
 * 验证邮箱请求
 */
export interface VerifyEmailRequest {
	token: string;
}


/**
 * 验证邮箱响应
 */
export interface VerifyEmailResponse {
	success: boolean;
	message: string;
}

