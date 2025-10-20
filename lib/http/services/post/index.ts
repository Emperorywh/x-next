/**
 * 帖子模块 - API 请求
 */

import { CreatePostDto, ListPostDto, UpdatePostDto } from '@/lib/api/post/post.schema';
import { httpClient } from '../../client';
import { Post, PostListResponse } from '@/lib/api/post/post.types';


/**
 * 创建帖子
 * @param data 创建帖子数据
 * @returns 创建结果
 */
export async function createPostApi(data: CreatePostDto) {
	return httpClient.post<Post>('/api/post/create', data);
}

/**
 * 获取帖子列表
 * @param data 查询参数
 * @returns 帖子列表
 */
export async function getPostListApi(data: ListPostDto) {
	return httpClient.post<PostListResponse>('/api/post/list', data);
}

/**
 * 更新帖子
 * @param data 更新帖子数据
 * @returns 更新结果
 */
export async function updatePostApi(data: UpdatePostDto) {
	return httpClient.put<Post>('/api/post/update', data);
}