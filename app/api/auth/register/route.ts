import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations/auth'
import { ZodError } from 'zod'
import { extractZodErrors, formatLocalDateTime, hashPassword } from '@/lib/utils'
import { VerificationCodeService } from '@/lib/redis'
import { NextResponseJson } from '@/lib/api-response'

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
				return NextResponseJson({ data: null, message: '用户名已被使用', success: false })
			}
			if (existingUser.email === validatedData.email) {
				return NextResponseJson({ data: null, message: '邮箱已被注册', success: false })
			}
			if (existingUser.phoneNumber === validatedData.phoneNumber) {
				return NextResponseJson({ data: null, message: '手机号已被注册', success: false })
			}
		}

		const codeResult = await VerificationCodeService.verifyCode(validatedData.email, validatedData.code);

		if (!codeResult.success) {
			return NextResponseJson({ data: null, message: codeResult.message, success: false })
		}

		// 加密密码
		const hashedPassword = await hashPassword(validatedData.password);

		console.log("hashedPassword:", hashedPassword)

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
		return NextResponseJson({
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
			success: true,
			status: 201
		})

	} catch (error) {

		// 处理 Zod 验证错误
		if (error instanceof ZodError) {
			const errorInfo = extractZodErrors(error)
			return NextResponseJson({ data: null, message: '数据验证失败', success: false, error: errorInfo.errors })
		}

		// 其他错误
		console.error('注册错误:', error)
		return NextResponseJson({ data: null, message: '注册失败', success: false, status: 500 })
	}
}