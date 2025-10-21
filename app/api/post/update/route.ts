import { postUpdate } from "@/app/actions/post/post.action";
import { ApiResponse, NextResponseJson } from "@/lib/api-response";
import { updatePostSchema } from "@/lib/api/post/post.schema";
import { Post } from "@/lib/api/post/post.types";
import { extractZodErrors } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

/**
 * 更新帖子
 * @param request 
 * @returns 
 */
export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponse<Post>>> {
    try {
        const headers = request.headers;
        const userId = headers.get('x-user-id');
        if (!userId) {
            return NextResponseJson({
                data: undefined,
                message: "请传入用户id",
                success: false,
                status: 400
            });
        }
        const body = await request.json();
        const validateData = updatePostSchema.parse(body);
        const response = await postUpdate(validateData, userId);
        return NextResponseJson(response);
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return NextResponseJson({
                data: undefined,
                message: "参数错误",
                success: false,
                error: extractZodErrors(error),
            });
        }
        return NextResponseJson({
            data: undefined,
            message: "服务器内部错误，请稍后重试",
            success: false,
            error: JSON.stringify(error)
        });
    }
}