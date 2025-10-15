/**
 * 认证模块 - API 请求
 */

import { httpClient } from '../../client';
import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
} from './types';

/**
 * 用户注册
 */
export async function registerApi(data: RegisterRequest) {
	return httpClient.post<RegisterResponse>('/api/auth/register', data);
}

/**
 * 用户登录
 * @param data 
 * @returns 
 */
export async function loginApi(data: LoginRequest) {
	return httpClient.post<LoginResponse>('/api/auth/login', data);
}