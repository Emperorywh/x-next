import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ZodError, ZodIssue } from "zod"
import bcrypt from 'bcryptjs'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}


/**
 * 格式化日期为本地时间字符串
 */
export function formatLocalDateTime(date: Date): string {
	return new Intl.DateTimeFormat('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
		timeZone: 'Asia/Shanghai' // 北京时间
	}).format(date)
}

/**
 * 提取 ZodError 中的所有错误信息
 */
export function extractZodErrors(error: ZodError): {
	message: string
	errors: Array<{
		field: string
		message: string
		code: string
	}>
} {
	const errors = error.issues.map((issue: ZodIssue) => ({
		field: issue.path.join('.'),
		message: issue.message,
		code: issue.code
	}))

	return {
		message: '数据验证失败',
		errors
	}
}


/**
 * 加密密码
 */
export async function hashPassword(password: string): Promise<string> {
	const SALT_ROUNDS = 12;
	return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * 验证密码
 * @param password 用户输入的明文密码
 * @param hashedPassword 数据库中存储的加密密码
 * @returns Promise<boolean> 密码是否正确
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
	return bcrypt.compare(password, hashedPassword);
}