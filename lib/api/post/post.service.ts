import { CreatePostDto, createPostSchema, GetPostByIdDto, GetRepliesDto, ListPostDto, listPostSchema, ReplyPostDto, UpdatePostDto, updatePostSchema } from "./post.schema";
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
            replyDepth: 0
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
                    // 关联数据
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                            verified: true,
                            bio: true,
                            followersCount: true,
                            followingCount: true
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

    /**
     * 根据帖子Id查询帖子信息
     * @param dto 
     */
    static async getPostById(dto: GetPostByIdDto) {
        if (!dto?.id) {
            return ServiceResponseJson({
                data: null,
                message: '请传入帖子ID',
                success: false,
            });
        }
        const result = await prisma.post.findUnique({
            where: {
                id: dto.id
            },
            include: {
                // 关联数据
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                        verified: true,
                        bio: true,
                        followersCount: true,
                        followingCount: true
                    }
                },
                // 回复给的用户信息
                replyToUser: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                        verified: true
                    }
                },
                // 父推文信息（如果是回复）
                parent: {
                    select: {
                        id: true,
                        content: true,
                        authorId: true,
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true,
                                verified: true
                            }
                        }
                    }
                }
            }
        });
        if (result) {
            return ServiceResponseJson({
                data: result,
                message: "查询成功",
                success: true,
            });
        } else {
            return ServiceResponseJson({
                data: result,
                message: "查询失败",
                success: false,
            });
        }
    }

    /**
     * 回复推文
     * @param dto 
     */
    static async reply(dto: ReplyPostDto) {
        const findPost = await prisma.post.findUnique({
            where: {
                id: dto.parentId
            }
        });
        if (!findPost) {
            return ServiceResponseJson({
                data: null,
                message: '未找到该推文',
                success: false,
            });
        }
        const user = await prisma.user.findFirst({
            where: {
                id: dto.authorId
            }
        });
        if (!user) {
            return ServiceResponseJson({
                data: undefined,
                message: "用户信息不存在",
                success: false,
            });
        }

        // 使用事务确保数据一致性
        const result = await prisma.$transaction(async (tx) => {
            // 创建回复推文
            const newReply = await tx.post.create({
                data: {
                    content: dto.content,
                    parentId: findPost.id,
                    replyToUserId: findPost.authorId,
                    conversationId: findPost.conversationId || findPost.id, // 如果是回复的回复，使用原始conversationId
                    authorId: user.id,
                    replyDepth: findPost.replyDepth + 1
                }
            });

            // 更新父推文的回复数（只统计直接回复）
            await tx.post.update({
                where: { id: findPost.id },
                data: {
                    repliesCount: {
                        increment: 1
                    }
                }
            });

            return newReply;
        });

        return ServiceResponseJson({
            data: result,
            message: "回复成功",
            success: true
        })
    }

    /**
     * 获取推文的回复列表
     * @param postId 推文ID
     * @param pageIndex 页码
     * @param pageSize 每页数量
     */
    static async getReplies(dto: GetRepliesDto) {
        const { postId, pageIndex, pageSize } = dto;
        if (!postId) {
            return ServiceResponseJson({
                data: null,
                message: '请传入推文ID',
                success: false,
            });
        }

        // 计算分页参数
        const skip = (pageIndex - 1) * pageSize;

        // 并行查询回复列表和总数
        const [replies, total] = await Promise.all([
            prisma.post.findMany({
                where: {
                    parentId: postId,
                    isDeleted: false
                },
                skip: skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                include: {
                    // 关联数据
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                            verified: true,
                            bio: true
                        }
                    },
                    replyToUser: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            verified: true
                        }
                    }
                }
            }),
            prisma.post.count({
                where: {
                    parentId: postId,
                    isDeleted: false
                }
            })
        ]);

        // 计算分页信息
        const totalPages = Math.ceil(total / pageSize);
        const hasNextPage = pageIndex < totalPages;
        const hasPrevPage = pageIndex > 1;

        return ServiceResponseJson({
            data: {
                list: replies,
                pagination: {
                    pageIndex: pageIndex,
                    pageSize: pageSize,
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
     * 获取整个对话线程
     * @param conversationId 对话线程ID（根推文ID）
     */
    static async getConversationThread(conversationId: string) {
        if (!conversationId) {
            return ServiceResponseJson({
                data: null,
                message: '请传入对话ID',
                success: false,
            });
        }

        // 获取根推文
        const rootPost = await prisma.post.findUnique({
            where: { id: conversationId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                        verified: true
                    }
                }
            }
        });

        if (!rootPost) {
            return ServiceResponseJson({
                data: null,
                message: '未找到该对话',
                success: false,
            });
        }

        // 获取该对话的所有回复
        const replies = await prisma.post.findMany({
            where: {
                conversationId: conversationId,
                isDeleted: false
            },
            orderBy: [
                { replyDepth: 'asc' },
                { createdAt: 'asc' }
            ],
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
                replyToUser: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        verified: true
                    }
                }
            }
        });

        return ServiceResponseJson({
            data: {
                rootPost: rootPost,
                replies: replies,
                totalReplies: replies.length
            },
            message: "查询成功",
            success: true
        });
    }
}