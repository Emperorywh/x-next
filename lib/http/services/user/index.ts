/**
 * 认证模块 - API 请求
 */

import { UserLoginDto, UserRegisterDto } from '@/lib/api/user/user.schema';
import { httpClient } from '../../client';
import { LoginResponse, RegisterResponse } from '@/lib/api/user/user.types';

/**
 * 用户注册
 */
export async function registerApi(data: UserRegisterDto) {
	return httpClient.post<RegisterResponse>('/api/user/register', data);
}

/**
 * 用户登录
 * @param data 
 * @returns 
 */
export async function loginApi(data: UserLoginDto) {
	return httpClient.post<LoginResponse>('/api/user/login', data);
}