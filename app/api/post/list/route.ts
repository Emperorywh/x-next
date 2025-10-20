import { ApiResponse, NextResponseJson } from "@/lib/api-response";
import { PostController } from "@/lib/api/post/post.controller";
import { listPostSchema } from "@/lib/api/post/post.schema";
import { PostListResponse } from "@/lib/api/post/post.types";
import { extractZodErrors } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

/**
 * 列表查询
 * @param request 
 * @returns 
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<PostListResponse>>> {
    try {
        const body = await request.json();
        const validateData = listPostSchema.parse(body);
        const response = await PostController.list(validateData);
        return NextResponseJson(response);

    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            return NextResponseJson({
                data: undefined,
                message: "参数错误",
                success: false,
                error: extractZodErrors(error)
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