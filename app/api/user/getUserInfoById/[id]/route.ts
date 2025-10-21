import { userGetInfoById } from "@/app/actions/user/user.action";
import { ApiResponse, NextResponseJson } from "@/lib/api-response";
import { getUserInfoSchema } from "@/lib/api/user/user.schema";
import { User } from "@/lib/api/user/user.types";
import { extractZodErrors } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

// 路径参数的类型定义
interface RouteParams {
    params: {
        id: string;
    };
}

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse<ApiResponse<User>>> {
    try {
        const { id: pathId } = await params;

        const validationResult = getUserInfoSchema.parse({ id: pathId });

        const response = await userGetInfoById(validationResult);

        return NextResponseJson(response);

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
