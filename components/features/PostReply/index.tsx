'use client';
import { MessageCircle } from "lucide-react";
import { PostReplyProps } from "./types";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReplyTextarea } from "./ReplyTextarea";
import { useState } from "react";
import MinioImage from "../MinioImage";

/**
 * 回复帖子
 */
export function PostReply(props: PostReplyProps) {

    const { post } = props;

    const [open, setOpen] = useState(false);

    // 格式化时间显示
    const formattedTime = () => {
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
    };

    return <Dialog open={open} onOpenChange={value => setOpen(value)}>
        <DialogTrigger asChild>
            <div className="flex items-center gap-1 cursor-pointer text-[#536471] hover:text-[#1D9BF0] transition-colors">
                <MessageCircle className="w-[35px] h-[35px] text-current transition-colors hover:bg-[#E8F5FD] p-2 rounded-full" />
                <span>{post.repliesCount}</span>
            </div>
        </DialogTrigger>
        <DialogContent className="w-[750px]">
            <DialogTitle />
            <DialogDescription />
            <div className="flex gap-2">
                <div className="shrink-0 flex flex-col items-center">
                    <MinioImage
                        objectName={post?.author?.image || ''}
                        alt={`${post.author.username} 头像`}
                        width={40}
                        height={40}
                        className='rounded-full w-[40px] h-[40px]'
                    />
                    <div className="w-[2px] bg-[#cfd9de] grow"></div>
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
                                    {formattedTime()}
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
                    <div className="flex items-center gap-2">
                        <span className="text-[#536471]">
                            回复
                        </span>
                        <span className="text-[#1d9bf0]">
                            @{post.author.name}
                        </span>
                    </div>
                </div>
            </div>
            <ReplyTextarea post={post} onSuccess={() => { setOpen(false) }} />
        </DialogContent>
    </Dialog>
}