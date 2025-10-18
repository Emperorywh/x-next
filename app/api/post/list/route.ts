import { NextResponseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { extractZodErrors } from "@/lib/utils";
import { NextRequest } from "next/server";
import z from "zod";

/**
 * 列表查询
 */
const lisrPostSchema = z.object({
    pageIndex: z.number("pageIndex不能为空"),
    pageSize: z.number("pageSize不能为空"),
    authorName: z.string().optional(),
    content: z.string().optional()
});

/**
 * 列表查询
 * @param request 
 * @returns 
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validateData = lisrPostSchema.parse(body);

        // 构建搜索条件
        const whereCondition: any = {
            isDeleted: false, // 只查询未删除的帖子
        };

        // 按作者名称搜索
        if (validateData.authorName) {
            whereCondition.author = {
                OR: [
                    { name: { contains: validateData.authorName, mode: 'insensitive' } },
                    { username: { contains: validateData.authorName, mode: 'insensitive' } }
                ]
            };
        }

        // 按内容搜索
        if (validateData.content) {
            whereCondition.content = {
                contains: validateData.content,
                mode: 'insensitive'
            };
        }

        // 计算分页参数
        const skip = (validateData.pageIndex - 1) * validateData.pageSize;

        // 并行查询列表数据和总数（推荐方式）
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: whereCondition,
                skip: skip,
                take: validateData.pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                            verified: true
                        }
                    },
                }
            }),
            prisma.post.count({
                where: whereCondition
            })
        ]);

        // 计算分页信息
        const totalPages = Math.ceil(total / validateData.pageSize);
        const hasNextPage = validateData.pageIndex < totalPages;
        const hasPrevPage = validateData.pageIndex > 1;

        return NextResponseJson({
            data: {
                list: posts,
                pagination: {
                    pageIndex: validateData.pageIndex,
                    pageSize: validateData.pageSize,
                    total: total,
                    totalPages: totalPages,
                    hasNextPage: hasNextPage,
                    hasPrevPage: hasPrevPage
                }
            },
            message: "查询成功",
            success: true
        });

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