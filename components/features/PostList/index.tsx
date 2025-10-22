import { postList } from "@/app/actions/post/post.action"
import { PostListClient } from "./PostListClient";
import { PostListSkeleton } from "./PostListSkeleton";
import { Suspense } from "react";

/**
 * 帖子列表
 */
export const PostList = () => {
    return (
        <Suspense fallback={<PostListSkeleton />}>
            <PostListAsync />
        </Suspense>
    );
}

/**
 * 异步获取帖子列表数据
 */
const PostListAsync = async () => {
    try {
        const response = await postList({
            pageIndex: 1,
            pageSize: 10
        });
        if (response.success) {
            return <PostListClient initialDataSource={response.data?.list} initialPagination={response.data.pagination} />
        }
        return <PostListSkeleton />
    } catch (error) {
        return <PostListSkeleton />
    }
}