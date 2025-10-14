/**
 * 认证模块 - API 请求
 */

import { httpClient } from '../../client';
import type {
	RegisterRequest,
	RegisterResponse,
} from './types';

/**
 * 用户注册
 */
export async function registerApi(data: RegisterRequest) {
	return httpClient.post<RegisterResponse>('/api/auth/register', data);
}
