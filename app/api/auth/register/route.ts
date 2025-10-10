import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations/auth'
import { ZodError } from 'zod'
import { extractZodErrors, formatLocalDateTime, hashPassword } from '@/lib/utils'

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
				return NextResponse.json(
					{ error: '用户名已被使用' },
					{ status: 400 }
				)
			}
			if (existingUser.email === validatedData.email) {
				return NextResponse.json(
					{ error: '邮箱已被注册' },
					{ status: 400 }
				)
			}
			if (existingUser.phoneNumber === validatedData.phoneNumber) {
				return NextResponse.json(
					{ error: '手机号已被注册' },
					{ status: 400 }
				)
			}
		}

		// 加密密码
		const hashedPassword = await hashPassword(validatedData.password)

		// 创建用户
		const user = await prisma.user.create({
			data: {
				username: validatedData.username,
				name: validatedData.name,
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
		return NextResponse.json(
			{
				message: '注册成功',
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
			{ status: 201 }
		)

	} catch (error) {

		// 处理 Zod 验证错误
		if (error instanceof ZodError) {
			console.error('注册错误:', error.issues)
			const errorInfo = extractZodErrors(error)
			return NextResponse.json(
				{
					error: errorInfo.errors,
				},
				{ status: 400 }
			)
		}

		// 其他错误
		return NextResponse.json(
			{ error: '服务器内部错误' },
			{ status: 500 }
		)
	}
}