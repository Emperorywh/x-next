import { CreatePostDto, createPostSchema, ListPostDto, listPostSchema, UpdatePostDto, updatePostSchema } from "./post.schema";
import { ServiceResponseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";


export class PostService {

    /**
     * 创建帖子
     * @param createPostDto 
     * @param userId 
     * @returns 
     */
    static async create(createPostDto: CreatePostDto, userId: string) {
        if (!userId) {
            return ServiceResponseJson({
                data: null,
                message: '请传入用户id',
                success: false,
            });
        }
        const validateData = createPostSchema.parse(createPostDto);
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        if (!user) {
            return ServiceResponseJson({
                data: undefined,
                message: "用户信息不存在",
                success: false,
            });
        }
        const newPost = await prisma.post.create({
            data: {
                content: validateData.content,
                authorId: user.id
            }
        });
        return ServiceResponseJson({
            data: newPost,
            message: "创建成功",
            success: true
        })
    }

    /**
     * 列表查询帖子
     * @param listPostDto 
     * @returns 
     */
    static async list(listPostDto: ListPostDto) {
        const validateData = listPostSchema.parse(listPostDto);
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

        return ServiceResponseJson({
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
    }

    /**
     * 更新帖子
     * @param updatePostDto 
     */
    static async update(updatePostDto: UpdatePostDto, userId: string) {
        if (!userId) {
            return ServiceResponseJson({
                data: null,
                message: '请传入用户id',
                success: false,
            });
        }
        const validateData = updatePostSchema.parse(updatePostDto);
        const oldPost = await prisma.post.findFirst({
            where: {
                id: validateData.id
            }
        });
        if (!oldPost) {
            return ServiceResponseJson({
                data: undefined,
                message: "该帖子未找到",
                success: false,
            });
        }
        if (!userId) {
            return ServiceResponseJson({
                data: undefined,
                message: "请传入用户id",
                success: false,
                status: 400
            });
        }
        if (oldPost.authorId !== userId) {
            return ServiceResponseJson({
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
        return ServiceResponseJson({
            data: newPost,
            message: "修改成功",
            success: true,
        });
    }
}