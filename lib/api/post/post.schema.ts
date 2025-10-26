import z from "zod";

/**
 * 创建帖子Schema
 */
export const createPostSchema = z.object({
    content: z.string("推文内容不能为空")
});

/**
 * 创建帖子DTO
 */
export type CreatePostDto = z.infer<typeof createPostSchema>;


/**
 * 列表查询Schema
 */
export const listPostSchema = z.object({
    pageIndex: z.number("pageIndex不能为空"),
    pageSize: z.number("pageSize不能为空"),
    authorName: z.string().optional(),
    content: z.string().optional()
});

/**
 * 列表查询DTO
 */
export type ListPostDto = z.infer<typeof listPostSchema>;

/**
 * 更新帖子Schema
 */
export const updatePostSchema = z.object({
    id: z.string("帖子ID不能为空"),
    content: z.string("帖子内容不能为空")
});

/**
 * 更新帖子DTO
 */
export type UpdatePostDto = z.infer<typeof updatePostSchema>;

/**
 * 根据帖子ID查询帖子信息Schema
 */
export const getPostByIdSchema = z.object({
    id: z.string("帖子ID不能为空"),
});

/**
 * 根据帖子ID查询帖子信息Dto
 */
export type GetPostByIdDto = z.infer<typeof getPostByIdSchema>;

/**
 * 回复推文Schema
 */
export const replyPostSchema = z.object({
    authorId: z.string("authorId不能为空"),
    content: z.string("content不能为空"),
    parentId: z.string("parentId不能为空"),
    replyToUserId: z.string("replyToUserId不能为空"),
    conversationId: z.string("conversationId不能为空"),
    replyDepth: z.number("replyDepth不能为空")
});

/**
 * 回复推文DTO
 */
export type ReplyPostDto = z.infer<typeof replyPostSchema>;

/**
 * 获取推文回复列表Schema
 */
export const getRepliesSchema = z.object({
    postId: z.string("推文ID不能为空"),
    pageIndex: z.number("pageIndex不能为空").default(1),
    pageSize: z.number("pageSize不能为空").default(20)
});

/**
 * 获取推文回复列表DTO
 */
export type GetRepliesDto = z.infer<typeof getRepliesSchema>;

/**
 * 获取对话线程Schema
 */
export const getConversationThreadSchema = z.object({
    conversationId: z.string("对话ID不能为空")
});

/**
 * 获取对话线程DTO
 */
export type GetConversationThreadDto = z.infer<typeof getConversationThreadSchema>;