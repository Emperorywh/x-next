/**
 * 邮件模块 - API 请求
 */

import { SendCodeVerificationCodeDto } from '@/lib/api/email/email.schema';
import { httpClient } from '../../client';
import { SendVerificationCodeRespnse } from '@/lib/api/email/email.types';


/**
 * 发送验证码
 */
export async function sendVerificationCodeApi(data: SendCodeVerificationCodeDto) {
	return httpClient.post<SendVerificationCodeRespnse>('/api/email/send-verification-code', data);
}
