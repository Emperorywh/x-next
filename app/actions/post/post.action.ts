'use server';
import { ApiResponse, ServiceResponseJson } from "@/lib/api-response";
import { withAuth } from "@/lib/api/auth/auth";
import { CreatePostDto, createPostSchema, GetPostByIdDto, getPostByIdSchema, ListPostDto, listPostSchema, ReplyPostDto, replyPostSchema, UpdatePostDto, updatePostSchema } from "@/lib/api/post/post.schema";
import { PostService } from "@/lib/api/post/post.service";
import { Post, PostListResponse } from "@/lib/api/post/post.types";
import { extractZodErrors } from "@/lib/utils";
import { headers } from "next/headers";
import { ZodError } from "zod";

/**
 * 创建帖子
 * @param createPostDto 
 * @param userId 
 * @returns 
 */
export const postCreate = withAuth(async (createPostDto: CreatePostDto, userId: string): Promise<ApiResponse<Post>> => {
    try {
        if (!userId) {
            return ServiceResponseJson({
                data: null,
                message: '请传入用户id',
                success: false,
            });
        }
        const validateData = createPostSchema.parse(createPostDto);
        const response = await PostService.create(validateData, userId);
        return ServiceResponseJson(response);
    } catch (error) {
        console.error('未知错误：', error);
        if (error instanceof ZodError) {
            const errorInfo = extractZodErrors(error)
            return ServiceResponseJson({
                data: null,
                message: '数据验证失败',
                success: false,
                error: errorInfo.errors
            })
        }
        return ServiceResponseJson({
            data: null,
            message: '系统错误',
            success: false,
            error: JSON.stringify(error)
        })
    }
})

const sleep = (time = 3000) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}

/**
* 列表查询帖子
* @param listPostDto 
* @returns 
*/
export const postList = withAuth(async (listPostDto: ListPostDto): Promise<ApiResponse<PostListResponse>> => {
    try {
        const validateData = listPostSchema.parse(listPostDto);
        const response = await PostService.list(validateData);
        await sleep();
        return ServiceResponseJson(response);
    } catch (error) {
        console.error('未知错误：', error);
        if (error instanceof ZodError) {
            const errorInfo = extractZodErrors(error)
            return ServiceResponseJson({
                data: null,
                message: '数据验证失败',
                success: false,
                error: errorInfo.errors
            })
        }
        return ServiceResponseJson({
            data: null,
            message: '系统错误',
            success: false,
            error: JSON.stringify(error)
        })
    }
})

/**
 * 更新帖子
 * @param updatePostDto 
 */
export const postUpdate = withAuth(async (updatePostDto: UpdatePostDto, userId: string): Promise<ApiResponse<Post>> => {
    try {
        if (!userId) {
            return ServiceResponseJson({
                data: null,
                message: '请传入用户id',
                success: false,
            });
        }
        const validateData = updatePostSchema.parse(updatePostDto);
        const response = await PostService.update(validateData, userId);
        return ServiceResponseJson(response)
    } catch (error) {
        console.error('未知错误：', error);
        if (error instanceof ZodError) {
            const errorInfo = extractZodErrors(error)
            return ServiceResponseJson({
                data: null,
                message: '数据验证失败',
                success: false,
                error: errorInfo.errors
            })
        }
        return ServiceResponseJson({
            data: null,
            message: '系统错误',
            success: false,
            error: JSON.stringify(error)
        })
    }
});

/**
 * 根据帖子ID 查询帖子
 */
export const postGetById = withAuth(async (dto: GetPostByIdDto): Promise<ApiResponse<Post>> => {
    try {
        const validateData = getPostByIdSchema.parse(dto);
        const response = await PostService.getPostById(validateData);
        return ServiceResponseJson(response);
    } catch (error) {
        console.error('未知错误：', error);
        if (error instanceof ZodError) {
            const errorInfo = extractZodErrors(error)
            return ServiceResponseJson({
                data: null,
                message: '数据验证失败',
                success: false,
                error: errorInfo.errors
            })
        }
        return ServiceResponseJson({
            data: null,
            message: '系统错误',
            success: false,
            error: JSON.stringify(error)
        })
    }
});

/**
 * 回复帖子
 */
export const postReply = withAuth(async (dto: ReplyPostDto): Promise<ApiResponse<Post>> => {
    try {
        const headersList = await headers();
        const authorId = headersList.get('x-user-id');
        if (authorId && !dto?.authorId) {
            dto.authorId = authorId;
        }
        const validateData = replyPostSchema.parse(dto);
        const response = await PostService.reply(validateData);
        return ServiceResponseJson(response);
    } catch (error) {
        console.error('未知错误：', error);
        if (error instanceof ZodError) {
            const errorInfo = extractZodErrors(error)
            return ServiceResponseJson({
                data: null,
                message: '数据验证失败',
                success: false,
                error: errorInfo.errors
            })
        }
        return ServiceResponseJson({
            data: null,
            message: '系统错误',
            success: false,
            error: JSON.stringify(error)
        })
    }
})