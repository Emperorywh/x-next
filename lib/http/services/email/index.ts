/**
 * 邮件模块 - API 请求
 */

import { httpClient } from '../../client';
import type {
	SendVerificationCodeRequest,
	SendVerificationCodeResponse,
	VerifyEmailRequest,
	VerifyEmailResponse,
} from './types';

/**
 * 发送验证码
 */
export async function sendVerificationCodeApi(data: SendVerificationCodeRequest) {
	return httpClient.post<SendVerificationCodeResponse>('/api/email/send-verification-code', data);
}

/**
 * 验证邮箱
 */
export async function verifyEmail(data: VerifyEmailRequest) {
	return httpClient.post<VerifyEmailResponse>('/api/email/verify', data);
}

