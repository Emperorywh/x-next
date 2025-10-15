import { NextResponseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { extractZodErrors } from "@/lib/utils";
import { NextRequest } from "next/server";
import z from "zod";

const getUserInfoSchema = z.object({
    id: z.string().min(1, "用户ID不能为空")
});

export async function GET(request: NextRequest) {
    try {
        const queryId = request.nextUrl.searchParams.get('id');

        const validationResult = getUserInfoSchema.parse({ id: queryId });

        const user = await prisma.user.findFirst({
            where: {
                id: validationResult.id
            },
        });

        if (user) {
            return NextResponseJson({
                data: {
                    ...user,
                    password: undefined
                },
                message: "获取成功",
                success: true
            });
        }
        return NextResponseJson({
            data: null,
            message: "用户ID错误",
            success: true
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponseJson({
                data: null,
                message: "参数错误",
                error: extractZodErrors(error),
                success: false,
                status: 400
            });
        }
        return NextResponseJson({
            data: null,
            message: "系统出错，请稍后重试",
            error: JSON.stringify(error),
            success: false,
            status: 500
        });
    }
}