import { NextResponseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { extractZodErrors } from "@/lib/utils";
import { NextRequest } from "next/server";
import z from "zod";

/**
 * 更新帖子
 */
const updatePostSchema = z.object({
    id: z.string("帖子ID不能为空"),
    content: z.string("帖子内容不能为空")
});

/**
 * 更新帖子
 * @param request 
 * @returns 
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const validateData = updatePostSchema.parse(body);
        const oldPost = await prisma.post.findFirst({
            where: {
                id: validateData.id
            }
        });
        if (!oldPost) {
            return NextResponseJson({
                data: undefined,
                message: "该帖子未找到",
                success: false,
            });
        }
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
        if (oldPost.authorId !== userId) {
            return NextResponseJson({
                data: undefined,
                message: "只能修改自己的帖子",
                success: false,
            });
        }
        const newPost = await prisma.post.update({
            where: {
                id: validateData.id
            },
            data: {
                ...oldPost,
                content: validateData.content,
                isEdited: true,
                editedAt: new Date()
            }
        });
        return NextResponseJson({
            data: newPost,
            message: "修改成功",
            success: true,
        });
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