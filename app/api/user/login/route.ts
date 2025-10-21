import { userLogin } from "@/app/actions/user/user.action";
import { ApiResponse, NextResponseJson } from "@/lib/api-response";
import { loginSchema } from "@/lib/api/user/user.schema";
import { User } from "@/lib/api/user/user.types";
import { extractZodErrors } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

/**
 * 用户登录
 * @param request 
 * @returns 
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<User>>> {
    try {

        const body = await request.json();

        const validateData = loginSchema.parse(body);

        const response = await userLogin(validateData);

        return NextResponseJson(response);

    } catch (error) {

        if (error instanceof z.ZodError) {
            return NextResponseJson({
                data: undefined,
                message: "请求参数验证失败",
                success: false,
                status: 400,
                error: extractZodErrors(error)
            });
        }

        console.error("登录API发生未知错误:", error);

        return NextResponseJson({
            data: undefined,
            message: "服务器内部错误，请稍后重试",
            success: false,
            status: 500,
            error: JSON.stringify(error)
        });
    }
}