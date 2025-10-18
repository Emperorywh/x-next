/**
 * 帖子模块 - API 请求
 */

import { httpClient } from '../../client';
import type {
	CreatePostRequest,
	CreatePostResponse,
	PostListRequest,
	PostListResponse,
	UpdatePostRequest,
	UpdatePostResponse,
	DeletePostRequest,
	DeletePostResponse,
	LikePostRequest,
	LikePostResponse,
	UnlikePostRequest,
	UnlikePostResponse,
	RetweetPostRequest,
	RetweetPostResponse,
	UnretweetPostRequest,
	UnretweetPostResponse,
	BookmarkPostRequest,
	BookmarkPostResponse,
	UnbookmarkPostRequest,
	UnbookmarkPostResponse,
	PostListData,
} from './types';

/**
 * 创建帖子
 * @param data 创建帖子数据
 * @returns 创建结果
 */
export async function createPostApi(data: CreatePostRequest) {
	return httpClient.post<CreatePostResponse>('/api/post/create', data);
}

/**
 * 获取帖子列表
 * @param data 查询参数
 * @returns 帖子列表
 */
export async function getPostListApi(data: PostListRequest) {
	return httpClient.post<PostListData>('/api/post/list', data);
}

/**
 * 更新帖子
 * @param data 更新帖子数据
 * @returns 更新结果
 */
export async function updatePostApi(data: UpdatePostRequest) {
	return httpClient.put<UpdatePostResponse>('/api/post/update', data);
}

/**
 * 删除帖子
 * @param data 删除帖子数据
 * @returns 删除结果
 */
export async function deletePostApi(data: DeletePostRequest) {
	return httpClient.delete<DeletePostResponse>(`/api/post/${data.id}`);
}

/**
 * 点赞帖子
 * @param data 点赞数据
 * @returns 点赞结果
 */
export async function likePostApi(data: LikePostRequest) {
	return httpClient.post<LikePostResponse>(`/api/post/${data.postId}/like`);
}

/**
 * 取消点赞帖子
 * @param data 取消点赞数据
 * @returns 取消点赞结果
 */
export async function unlikePostApi(data: UnlikePostRequest) {
	return httpClient.delete<UnlikePostResponse>(`/api/post/${data.postId}/like`);
}

/**
 * 转发帖子
 * @param data 转发数据
 * @returns 转发结果
 */
export async function retweetPostApi(data: RetweetPostRequest) {
	return httpClient.post<RetweetPostResponse>(`/api/post/${data.postId}/retweet`);
}

/**
 * 取消转发帖子
 * @param data 取消转发数据
 * @returns 取消转发结果
 */
export async function unretweetPostApi(data: UnretweetPostRequest) {
	return httpClient.delete<UnretweetPostResponse>(`/api/post/${data.postId}/retweet`);
}

/**
 * 收藏帖子
 * @param data 收藏数据
 * @returns 收藏结果
 */
export async function bookmarkPostApi(data: BookmarkPostRequest) {
	return httpClient.post<BookmarkPostResponse>(`/api/post/${data.postId}/bookmark`);
}

/**
 * 取消收藏帖子
 * @param data 取消收藏数据
 * @returns 取消收藏结果
 */
export async function unbookmarkPostApi(data: UnbookmarkPostRequest) {
	return httpClient.delete<UnbookmarkPostResponse>(`/api/post/${data.postId}/bookmark`);
}
