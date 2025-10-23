import { Post } from "@/lib/api/post/post.types";
import { ChartNoAxesColumnIncreasing, Heart, MessageCircle, Repeat2 } from "lucide-react";
import Image from 'next/image';
import { useMemo } from "react";
import { PostReply } from "../PostReply";
import { PostForward } from "../PostForward";
import { PostViews } from "../PostViews";
import { PostLike } from "../PostLike";

/**
 * 单个帖子组件
 */
export const PostItem = ({ post }: { post: Post }) => {
    // 格式化时间显示
    const formattedTime = useMemo(() => {
        const now = new Date();
        const postTime = new Date(post.createdAt);
        const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return '刚刚';
        if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}天前`;

        return postTime.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric'
        });
    }, [post.createdAt]);
    return (
        <div className="flex gap-2 border-b-1 p-4 hover:bg-gray-50 transition-colors">
            <div className="shrink-0">
                <Image
                    src={post?.author?.image || ''}
                    alt={`${post.author.username} 头像`}
                    width={40}
                    height={40}
                    className='rounded-full'
                />
            </div>
            <div className="grow">
                <div className="mb-2">
                    <div className="flex items-center gap-3">
                        <span className="font-bold">
                            {post?.author?.name || post?.author?.username}
                        </span>
                        <span className="text-gray-400">
                            @{post?.author?.username}
                        </span>
                        <div className="text-gray-400 flex items-center gap-2">
                            <span>·</span>
                            <span className="text-[14px]">
                                {formattedTime}
                            </span>
                        </div>
                    </div>
                </div>
                <div
                    className="mb-2 text-[#0F1419] whitespace-pre-wrap break-words overflow-hidden"
                    style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-all',
                        overflowWrap: 'anywhere',
                    }}
                >
                    {post.content}
                </div>
                <div className="flex items-center justify-between">
                    <PostReply post={post} />
                    <PostForward post={post} />
                    <PostLike post={post} />
                    <PostViews post={post} />
                </div>
            </div>
        </div>
    );
};