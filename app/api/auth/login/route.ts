import { NextResponseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { extractZodErrors, hashPassword, verifyPassword } from "@/lib/utils";
import { loginSchema } from "@/lib/validations/auth";
import { NextRequest } from "next/server";
import z from "zod";

/**
 * 登录接口
 * @param request 
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const validateData = loginSchema.parse(body);
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    ...(validateData?.email ? [{ email: validateData.email }] : []),
                    ...(validateData?.phoneNumber ? [{ phoneNumber: validateData.phoneNumber }] : []),
                    ...(validateData?.username ? [{ username: validateData.username }] : [])
                ]
            }
        });
        if (!existingUser) {
            return NextResponseJson({
                data: null,
                message: "用户不存在，请检查邮箱、电话、用户名是否正确",
                success: false
            });
        }
        const isPasswordValid = await verifyPassword(validateData.password, existingUser.password!);
        if (!isPasswordValid) {
            return NextResponseJson({
                data: null,
                message: "密码错误",
                success: false
            });
        }
        return NextResponseJson({
            data: {
                ...existingUser,
                password: undefined
            },
            message: "登录成功",
            success: true
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponseJson({
                data: null,
                message: "参数错误",
                error: extractZodErrors(error),
                success: false
            })
        }
        return NextResponseJson({
            data: null,
            message: "系统错误，请稍后重试",
            error: JSON.stringify(error),
            success: false
        })
    }
}