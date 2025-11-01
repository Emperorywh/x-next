import z from "zod"

/**
 * 用户注册Schema
 */
export const registerSchema = z.object({
    username: z
        .string()
        .min(3, "用户名至少需要3个字符")
        .max(20, "用户名不能超过20个字符")
        .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
    email: z
        .string()
        .email("请输入有效的邮箱地址"),
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
        }, "年龄必须在18-200岁之间"),
    code: z.string().length(6, '验证码必须是6位')
});

/**
 * 用户注册DTO
 */
export type UserRegisterDto = z.infer<typeof registerSchema>;

/**
 * 用户登录Schema
 */
export const loginSchema = z.object({
    username: z
        .string()
        .optional()
        .refine((value) => !value || (value.length >= 3 && value.length <= 20 && /^[a-zA-Z0-9_]+$/.test(value)), { message: '用户名至少需要3个字符，最多20个字符，只能包含字母、数字和下划线' }),
    email: z
        .string()
        .optional()
        .refine((value) => !value || (z.string().email().safeParse(value).success), { message: "请输入有效的邮箱地址" }),
    phoneNumber: z
        .string()
        .optional()
        .refine((value) => !value || (/^1[3-9]\d{9}$/.test(value)), { message: "请输入有效的手机号" }),
    password: z
        .string()
        .min(8, "密码至少需要8个字符")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "密码必须包含大小写字母和数字")
}).refine((data) => data.email || data.phoneNumber || data.username, { message: "请至少输入用户名、手机号或邮箱中的一种" });

/**
 * 用户登录DTO
 */
export type UserLoginDto = z.infer<typeof loginSchema>;


/**
 * 根据用户ID获取用户信息Schema
 */
export const getUserInfoSchema = z.object({
    id: z.string().min(1, "用户ID不能为空")
});

/**
 * 根据用户ID获取用户信息DTO
 */
export type GetUserInfoSchemaDto = z.infer<typeof getUserInfoSchema>;

/**
 * 根据username获取用户信息Schema
 */
export const getUserInfoByUsernameSchema = z.object({
    username: z.string().min(1, "username不能为空")
});

/**
 * 根据username取用户信息DTO
 */
export type GetUserInfoUsernameSchemaDto = z.infer<typeof getUserInfoByUsernameSchema>;

/**
 * 更新用户信息schema
 */
export const updateUserInfoSchema = z.object({
    id: z.string().min(1, "用户ID不能为空"),
    name: z.string().min(2, {
        message: "名称至少两位",
    }),
    bio: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    image: z.string().optional(),
    coverImage: z.string().optional(),
    birthDate: z
        .string()
        .refine((date) => {
            const birthDate = new Date(date)
            const today = new Date()
            const age = today.getFullYear() - birthDate.getFullYear()
            return age >= 18 && age <= 200
        }, "年龄必须在18-200岁之间"),
});

/**
 * 更新用户信息DTO
 */
export type UpdateUserInfoDto = z.infer<typeof updateUserInfoSchema>;