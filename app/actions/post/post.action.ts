'use server';
import { ApiResponse, ServiceResponseJson } from "@/lib/api-response";
import { CreatePostDto, createPostSchema, ListPostDto, listPostSchema, UpdatePostDto, updatePostSchema } from "@/lib/api/post/post.schema";
import { PostService } from "@/lib/api/post/post.service";
import { Post, PostListResponse } from "@/lib/api/post/post.types";
import { extractZodErrors } from "@/lib/utils";
import { ZodError } from "zod";

/**
 * 创建帖子
 * @param createPostDto 
 * @param userId 
 * @returns 
 */
export async function postCreate(createPostDto: CreatePostDto, userId: string): Promise<ApiResponse<Post>> {
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
}

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
export async function postList(listPostDto: ListPostDto): Promise<ApiResponse<PostListResponse>> {
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
}

/**
 * 更新帖子
 * @param updatePostDto 
 */
export async function postUpdate(updatePostDto: UpdatePostDto, userId: string): Promise<ApiResponse<Post>> {
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
}