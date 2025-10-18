/**
 * 帖子模块 - 类型定义
 */

import { ResponseData } from "../../client";

/**
 * 帖子作者信息
 */
export interface PostAuthor {
	id: string;
	name: string | null;
	username: string;
	image: string | null;
	verified: boolean;
}

/**
 * 帖子信息
 */
export interface Post {
	id: string;
	content: string;
	authorId: string;
	parentId: string | null;
	isRetweet: boolean;
	originalId: string | null;
	isDeleted: boolean;
	isEdited: boolean;
	editedAt: Date | null;
	likesCount: number;
	retweetsCount: number;
	repliesCount: number;
	bookmarksCount: number;
	createdAt: Date;
	updatedAt: Date;
	author: PostAuthor;
}

/**
 * 分页信息
 */
export interface PaginationInfo {
	pageIndex: number;
	pageSize: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

/**
 * 帖子列表响应数据
 */
export interface PostListData {
	list: Post[];
	pagination: PaginationInfo;
}

/**
 * 创建帖子请求
 */
export interface CreatePostRequest {
	content: string;
}

/**
 * 创建帖子响应
 */
export interface CreatePostResponse extends ResponseData<Post> { }

/**
 * 帖子列表查询请求
 */
export interface PostListRequest {
	pageIndex: number;
	pageSize: number;
	authorName?: string;
	content?: string;
}

/**
 * 帖子列表查询响应
 */
export interface PostListResponse extends ResponseData<PostListData> { }

/**
 * 更新帖子请求
 */
export interface UpdatePostRequest {
	id: string;
	content: string;
}

/**
 * 更新帖子响应
 */
export interface UpdatePostResponse extends ResponseData<Post> { }

/**
 * 删除帖子请求
 */
export interface DeletePostRequest {
	id: string;
}

/**
 * 删除帖子响应
 */
export interface DeletePostResponse extends ResponseData<null> { }

/**
 * 点赞帖子请求
 */
export interface LikePostRequest {
	postId: string;
}

/**
 * 点赞帖子响应
 */
export interface LikePostResponse extends ResponseData<null> { }

/**
 * 取消点赞帖子请求
 */
export interface UnlikePostRequest {
	postId: string;
}

/**
 * 取消点赞帖子响应
 */
export interface UnlikePostResponse extends ResponseData<null> { }

/**
 * 转发帖子请求
 */
export interface RetweetPostRequest {
	postId: string;
}

/**
 * 转发帖子响应
 */
export interface RetweetPostResponse extends ResponseData<Post> { }

/**
 * 取消转发帖子请求
 */
export interface UnretweetPostRequest {
	postId: string;
}

/**
 * 取消转发帖子响应
 */
export interface UnretweetPostResponse extends ResponseData<null> { }

/**
 * 收藏帖子请求
 */
export interface BookmarkPostRequest {
	postId: string;
}

/**
 * 收藏帖子响应
 */
export interface BookmarkPostResponse extends ResponseData<null> { }

/**
 * 取消收藏帖子请求
 */
export interface UnbookmarkPostRequest {
	postId: string;
}

/**
 * 取消收藏帖子响应
 */
export interface UnbookmarkPostResponse extends ResponseData<null> { }
