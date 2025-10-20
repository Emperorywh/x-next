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