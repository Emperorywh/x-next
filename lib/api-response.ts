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
	message?: string;
	/** 是否成功 */
	success?: boolean;
	/** 错误信息 */
	error?: string | Record<string, any>;
	/** 状态码 */
	code?: number;
}

/**
 * 成功响应配置
 */
export interface SuccessResponseOptions {
	/** 响应数据 */
	data: any;
	/** 响应消息 */
	message?: string;
	/** HTTP 状态码 */
	status?: number;
}

/**
 * 成功响应
 */
export function successResponse<T>(
	options: SuccessResponseOptions
): NextResponse<ApiResponse<T>> {
	const { data, message = '操作成功', status = 200 } = options;

	return NextResponse.json<ApiResponse<T>>(
		{
			data,
			message,
			success: true,
			code: status,
		},
		{ status }
	);
}

/**
 * 错误响应配置
 */
export interface ErrorResponseOptions {
	/** 错误信息 */
	error: string | Record<string, any>;
	/** 响应消息 */
	message?: string;
	/** HTTP 状态码 */
	status?: number;
}

/**
 * 错误响应
 */
export function errorResponse(
	options: ErrorResponseOptions
): NextResponse<ApiResponse<null>> {
	const { error, message = '操作失败', status = 400 } = options;

	return NextResponse.json<ApiResponse<null>>(
		{
			data: null,
			message,
			success: false,
			error,
			code: status,
		},
		{ status }
	);
}

/**
 * 创建响应
 */
export function createResponse<T>(
	data: T | null,
	options?: {
		message?: string;
		success?: boolean;
		error?: string | Record<string, any>;
		status?: number;
	}
): NextResponse<ApiResponse<T | null>> {
	const {
		message,
		success = data !== null,
		error,
		status = success ? 200 : 400,
	} = options || {};

	return NextResponse.json<ApiResponse<T | null>>(
		{
			data,
			message: message || (success ? '操作成功' : '操作失败'),
			success,
			error,
			code: status,
		},
		{ status }
	);
}

/**
 * 常用状态码响应
 */
export const responses = {
	// 成功响应
	ok: <T>(data: T, message?: string) =>
		successResponse({ data, message, status: 200 }),
	created: <T>(data: T, message?: string) =>
		successResponse({ data, message, status: 201 }),
	accepted: <T>(data: T, message?: string) =>
		successResponse({ data, message, status: 202 }),

	// 错误响应
	badRequest: (error: string | Record<string, any>, message?: string) =>
		errorResponse({ error, message, status: 400 }),
	unauthorized: (error: string | Record<string, any>, message?: string) =>
		errorResponse({ error, message, status: 401 }),
	forbidden: (error: string | Record<string, any>, message?: string) =>
		errorResponse({ error, message, status: 403 }),
	notFound: (error: string | Record<string, any>, message?: string) =>
		errorResponse({ error, message, status: 404 }),
	conflict: (error: string | Record<string, any>, message?: string) =>
		errorResponse({ error, message, status: 409 }),
	unprocessableEntity: (error: string | Record<string, any>, message?: string) =>
		errorResponse({ error, message, status: 422 }),
	tooManyRequests: (error: string | Record<string, any>, message?: string) =>
		errorResponse({ error, message, status: 429 }),
	internalServerError: (error: string | Record<string, any>, message?: string) =>
		errorResponse({ error, message, status: 500 }),
	badGateway: (error: string | Record<string, any>, message?: string) =>
		errorResponse({ error, message, status: 502 }),
	serviceUnavailable: (error: string | Record<string, any>, message?: string) =>
		errorResponse({ error, message, status: 503 }),
	gatewayTimeout: (error: string | Record<string, any>, message?: string) =>
		errorResponse({ error, message, status: 504 }),
};

/**
 * 验证错误响应
 */
export function validationErrorResponse(
	errors: Record<string, string[]>,
	message: string = '数据验证失败'
): NextResponse<ApiResponse<null>> {
	return errorResponse({ error: errors, message, status: 422 });
}

/**
 * 服务器错误响应
 */
export function serverErrorResponse(
	error: string = '服务器内部错误',
	message: string = '服务器错误，请稍后重试'
): NextResponse<ApiResponse<null>> {
	return errorResponse({ error, message, status: 500 });
}

/**
 * 未授权响应
 */
export function unauthorizedResponse(
	error: string = '未授权访问',
	message: string = '请先登录'
): NextResponse<ApiResponse<null>> {
	return errorResponse({ error, message, status: 401 });
}

/**
 * 禁止访问响应
 */
export function forbiddenResponse(
	error: string = '没有权限',
	message: string = '没有权限访问此资源'
): NextResponse<ApiResponse<null>> {
	return errorResponse({ error, message, status: 403 });
}

/**
 * 资源不存在响应
 */
export function notFoundResponse(
	error: string = '资源不存在',
	message: string = '请求的资源不存在'
): NextResponse<ApiResponse<null>> {
	return errorResponse({ error, message, status: 404 });
}
