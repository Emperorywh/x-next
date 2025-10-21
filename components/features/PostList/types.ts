import { PaginationInfo, Post } from "@/lib/api/post/post.types";

export interface IPostListProps {
    initialDataSource: Post[];
    initialPagination: PaginationInfo;
}