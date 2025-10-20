
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
export interface PostListResponse {
    list: Post[];
    pagination: PaginationInfo;
}
