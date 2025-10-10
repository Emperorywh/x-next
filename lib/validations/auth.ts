import { z } from "zod"

// 注册表单验证 schema
export const registerSchema = z.object({
	username: z
		.string()
		.min(3, "用户名至少需要3个字符")
		.max(20, "用户名不能超过20个字符")
		.regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
	name: z
		.string()
		.min(2, "昵称至少需要2个字符")
		.max(50, "昵称不能超过50个字符"),
	email: z
		.string()
		.email("请输入有效的邮箱地址")
		.optional(),
	phoneNumber: z
		.string()
		.regex(/^1[3-9]\d{9}$/, "请输入有效的手机号")
		.optional(),
	password: z
		.string()
		.min(8, "密码至少需要8个字符")
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "密码必须包含大小写字母和数字"),
	birthDate: z
		.string()
		.refine((date) => {
			const birthDate = new Date(date)
			const today = new Date()
			const age = today.getFullYear() - birthDate.getFullYear()
			return age >= 18 && age <= 200
		}, "年龄必须在18-200岁之间")
}).refine((data) => {
	// 确保至少提供邮箱或手机号之一
	return data.email || data.phoneNumber
}, {
	message: "请提供邮箱或手机号",
	path: ["email"]
})

export type RegisterInput = z.infer<typeof registerSchema>