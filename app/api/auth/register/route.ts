import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations/auth'
import { ZodError } from 'zod'
import { extractZodErrors, formatLocalDateTime, hashPassword } from '@/lib/utils'
import { VerificationCodeService } from '@/lib/redis'
import {
	successResponse,
	errorResponse,
	serverErrorResponse,
} from '@/lib/api-response'

export async function POST(request: NextRequest) {
	try {
		// 解析请求体
		const body = await request.json()

		// 验证输入数据
		const validatedData = registerSchema.parse(body)

		// 检查用户名是否已存在
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{ username: validatedData.username },
					...(validatedData.email ? [{ email: validatedData.email }] : []),
					...(validatedData.phoneNumber ? [{ phoneNumber: validatedData.phoneNumber }] : [])
				]
			}
		})

		if (existingUser) {
			if (existingUser.username === validatedData.username) {
				return errorResponse({ error: '用户名已被使用', message: '用户名已被使用', status: 400 })
			}
			if (existingUser.email === validatedData.email) {
				return errorResponse({ error: '邮箱已被注册', message: '邮箱已被注册', status: 400 })
			}
			if (existingUser.phoneNumber === validatedData.phoneNumber) {
				return errorResponse({ error: '手机号已被注册', message: '手机号已被注册', status: 400 })
			}
		}

		const codeResult = await VerificationCodeService.verifyCode(validatedData.email, validatedData.code);

		if (!codeResult.success) {
			return errorResponse({ error: codeResult.message, message: codeResult.message, status: 400 })
		}

		// 加密密码
		const hashedPassword = await hashPassword(validatedData.password)

		// 创建用户
		const user = await prisma.user.create({
			data: {
				username: validatedData.username,
				email: validatedData.email,
				phoneNumber: validatedData.phoneNumber,
				password: hashedPassword,
				birthDate: new Date(validatedData.birthDate),
				// 其他字段使用默认值
				verified: false,
				protected: false,
				followersCount: 0,
				followingCount: 0,
				postsCount: 0,
				likesCount: 0,
			},
			select: {
				id: true,
				username: true,
				name: true,
				email: true,
				phoneNumber: true,
				verified: true,
				createdAt: true,
				// 不返回密码
			}
		})

		// 返回成功响应
		return successResponse({
			data: {
				user: {
					id: user.id,
					username: user.username,
					name: user.name,
					email: user.email,
					phoneNumber: user.phoneNumber,
					verified: user.verified,
					createdAt: user.createdAt,
					createdAtLocal: formatLocalDateTime(user.createdAt)
				}
			},
			message: '注册成功',
			status: 201
		})

	} catch (error) {

		// 处理 Zod 验证错误
		if (error instanceof ZodError) {
			console.error('注册错误:', error.issues)
			const errorInfo = extractZodErrors(error)
			return errorResponse({ error: errorInfo.errors, message: '数据验证失败', status: 400 })
		}

		// 其他错误
		console.error('注册错误:', error)
		return serverErrorResponse('注册失败')
	}
}