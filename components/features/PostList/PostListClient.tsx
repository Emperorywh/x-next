'use client';
import { IPostListProps } from "./types";
import { useEffect, useRef, useState } from "react";
import { Post } from "@/lib/api/post/post.types";
import { PostItem } from "./PostItem";
import { postList } from "@/app/actions/post/post.action";
import { PostListSkeleton } from "./PostListSkeleton";

/**
 * 帖子列表客户端组件
 * 支持无限滚动加载更多帖子
 */
export const PostListClient = (props: IPostListProps) => {

    const { initialDataSource = [], initialPagination } = props;

    const [dataSource, setDataSource] = useState<Post[]>(initialDataSource);

    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState(initialPagination);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // 加载更多帖子的函数
    const loadMore = async () => {
        if (loading || !pagination.hasNextPage) {
            return;
        }
        setLoading(true);
        try {
            const response = await postList({
                pageIndex: pagination.pageIndex + 1,
                pageSize: pagination.pageSize
            });
            console.log("pagination", pagination);
            if (response.success && response.data) {
                setDataSource(prev => [...prev, ...response.data.list]);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.error('加载帖子失败:', err);
        } finally {
            setLoading(false);
        }
    }

    // 设置无限滚动观察器
    useEffect(() => {
        const el = sentinelRef?.current;
        if (!el || !pagination.hasNextPage) return;
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !loading) {
                    loadMore();
                }
            },
            {
                rootMargin: '10px',
                threshold: 0.1
            }
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            {/* 帖子列表 */}
            <div className="grow overflow-y-auto">
                {
                    dataSource.map(post => (
                        <PostItem post={post} key={post.id} />
                    ))
                }
                {
                    loading && dataSource.length > 0 && <PostListSkeleton />
                }
                {!pagination.hasNextPage && dataSource.length > 0 && (
                    <div className="flex justify-center items-center py-6 text-gray-400">
                        <div className="text-center">
                            <div className="text-sm">没有更多内容了</div>
                            <div className="text-xs mt-1">已经到底了</div>
                        </div>
                    </div>
                )}
            </div>

            {pagination.hasNextPage && (
                <div ref={sentinelRef} className="h-1 w-full" />
            )}
        </div>
    );
};