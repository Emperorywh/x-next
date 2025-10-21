import { getUserInfoSchema, GetUserInfoSchemaDto, registerSchema, UserLoginDto, UserRegisterDto } from "./user.schema";
import { formatLocalDateTime, hashPassword, verifyPassword } from "@/lib/utils";
import { ServiceResponseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { VerificationCodeService } from "@/lib/redis";
import { LoginResponse, User } from "./user.types";
import { JWTService } from "../jwt/jwt.service";

export class UserService {

    /**
     * 用户注册
     * @param userRegister 
     * @returns 
     */
    static async register(userRegister: UserRegisterDto) {
        // 验证输入数据
        const validatedData = registerSchema.parse(userRegister);

        // 检查用户名是否已存在
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: validatedData.username },
                    ...(validatedData.email ? [{ email: validatedData.email }] : []),
                    ...(validatedData.phoneNumber ? [{ phoneNumber: validatedData.phoneNumber }] : [])
                ]
            }
        });
        if (existingUser) {
            if (existingUser.username === validatedData.username) {
                return ServiceResponseJson({ data: null, message: '用户名已被使用', success: false })
            }
            if (existingUser.email === validatedData.email) {
                return ServiceResponseJson({ data: null, message: '邮箱已被注册', success: false })
            }
            if (existingUser.phoneNumber === validatedData.phoneNumber) {
                return ServiceResponseJson({ data: null, message: '手机号已被注册', success: false })
            }
        }
        const codeResult = await VerificationCodeService.verifyCode(validatedData.email, validatedData.code);

        if (!codeResult.success) {
            return ServiceResponseJson({ data: null, message: codeResult.message, success: false })
        }

        // 加密密码
        const hashedPassword = await hashPassword(validatedData.password);

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
        });

        // 返回成功响应
        return ServiceResponseJson<{ user: User }>({
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
    }

    /**
     * 用户登录
     * @param userLogin 
     * @returns 
     */
    static async login(userLogin: UserLoginDto) {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    ...(userLogin?.email ? [{ email: userLogin.email }] : []),
                    ...(userLogin?.phoneNumber ? [{ phoneNumber: userLogin.phoneNumber }] : []),
                    ...(userLogin?.username ? [{ username: userLogin.username }] : [])
                ]
            }
        });
        if (!existingUser) {
            return ServiceResponseJson({
                data: null,
                message: '用户不存在，请检查邮箱、电话、用户名是否正确',
                success: false,
            })
        }
        const isPasswordValid = await verifyPassword(userLogin.password, existingUser.password!);
        if (!isPasswordValid) {
            return ServiceResponseJson({
                data: null,
                message: '密码错误',
                success: false,
            })
        }
        return ServiceResponseJson<LoginResponse>({
            data: {
                user: {
                    ...existingUser,
                    password: undefined
                },
                token: await JWTService.generateAccessToken({
                    userId: existingUser.id
                }),
                refreshToken: await JWTService.generateRefreshToken({
                    userId: existingUser.id
                })
            },
            message: '登录成功',
            success: true,
        })
    }

    /**
     * 根据用户ID查询用户信息
     * @param idDto 
     * @returns 
     */
    static async getUserInfoById(idDto: GetUserInfoSchemaDto) {
        // 验证路径参数
        const validationResult = getUserInfoSchema.parse(idDto);

        const user = await prisma.user.findFirst({
            where: {
                id: validationResult.id
            },
        });
        if (user) {
            return ServiceResponseJson({
                data: {
                    ...user,
                    password: undefined
                },
                message: "获取成功",
                success: true
            });
        }
        return ServiceResponseJson({
            data: null,
            message: "用户ID错误",
            success: true
        });
    }
}