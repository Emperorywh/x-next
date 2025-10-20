import { ZodError } from "zod";
import { CreatePostDto, createPostSchema, ListPostDto, listPostSchema, UpdatePostDto, updatePostSchema } from "./post.schema";
import { extractZodErrors } from "@/lib/utils";
import { ApiResponse, ServiceResponseJson } from "@/lib/api-response";
import { PostService } from "./post.service";
import { Post, PostListResponse } from "./post.types";

export class PostController {
    /**
     * 创建帖子
     * @param createPostDto 
     * @param userId 
     * @returns 
     */
    static async create(createPostDto: CreatePostDto, userId: string): Promise<ApiResponse<Post>> {
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

    /**
     * 列表查询帖子
     * @param listPostDto 
     * @returns 
     */
    static async list(listPostDto: ListPostDto): Promise<ApiResponse<PostListResponse>> {
        try {
            const validateData = listPostSchema.parse(listPostDto);
            const response = await PostService.list(validateData);
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
    static async update(updatePostDto: UpdatePostDto, userId: string): Promise<ApiResponse<Post>> {
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
}