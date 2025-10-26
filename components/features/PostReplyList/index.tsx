import { postReplyList } from "@/app/actions/post/post.action";
import { PostListSkeleton } from "../PostList/PostListSkeleton"
import { PostListClient } from "../PostList/PostListClient";
import { Suspense } from "react";

export const PostReplyList = ({ postId }: { postId: string }) => {
    return (
        <Suspense fallback={<PostListSkeleton count={1}/>}>
            <PostReplyListAsync postId={postId} />
        </Suspense>
    );
}

const PostReplyListAsync = async ({ postId }: { postId: string }) => {
    try {
        const response = await postReplyList({
            postId,
            pageIndex: 1,
            pageSize: 10
        });
        if (response.success) {
            return <PostListClient initialDataSource={response?.data?.list} initialPagination={response.data?.pagination} />
        }
        return <PostListSkeleton count={1}/>
    } catch (error) {
        return <PostListSkeleton count={1}/>
    }
}