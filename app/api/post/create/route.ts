import { NextResponseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { extractZodErrors } from "@/lib/utils";
import { NextRequest } from "next/server";
import z from "zod";

/**
 * 创建帖子Schema
 */
const createPostSchema = z.object({
    content: z.string("推文内容不能为空")
});

/**
 * 创建帖子
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const postInfo = createPostSchema.parse(body);
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
        const user = await prisma.user.findFirst({
            where: {
                id: headers.get('x-user-id') || ''
            }
        });
        if (!user) {
            return NextResponseJson({
                data: undefined,
                message: "用户信息不存在",
                success: false,
            });
        }
        const newPost = await prisma.post.create({
            data: {
                content: postInfo.content,
                authorId: user.id
            }
        });
        return NextResponseJson({
            data: newPost,
            message: "创建成功",
            success: true
        })
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