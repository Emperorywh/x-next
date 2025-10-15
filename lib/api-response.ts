/**
 * API 响应工具函数
 * 统一 Next.js API 路由的响应格式
 */

import { NextResponse } from 'next/server';

/**
 * 统一响应数据结构（与前端 ResponseData 保持一致）
 */
export interface ApiResponse<T = any> {
	/** 响应数据 */
	data: T;
	/** 响应消息 */
	message: string;
	/** 是否成功 */
	success: boolean;
	/** 错误信息 */
	error?: string | Record<string, any> | Array<{
		field: string
		message: string
		code: string
	}>;
	/** 状态码 */
	code?: string | number;
}

/**
 * 成功响应配置
 */
export interface NextResponseOptions {
	/** 响应数据 */
	data: any;
	/** 响应消息 */
	message: string;
	/** 操作是否成功 */
	success: boolean;
	/** HTTP 状态码 */
	status?: number;
	/** 自定义code */
	code?: string | number;
	/** 错误信息 */
	error?: string | Record<string, any> | Array<{
		field: string
		message: string
		code: string
	}>;
}

export function NextResponseJson<T>(
	options: NextResponseOptions
): NextResponse<ApiResponse<T>> {
	const { data, message = '操作成功', success = false, status = 200, code = '', error } = options;

	return NextResponse.json<ApiResponse<T>>(
		{
			data,
			message,
			success,
			code,
			error,
		},
		{ status }
	);
}