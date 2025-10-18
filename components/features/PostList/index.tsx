import { IPostListProps } from "./types";
import Image from 'next/image';
import { ChartNoAxesColumnIncreasing, Heart, MessageCircle, Repeat2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Post } from "@/lib/http/services/post/types";
import { getPostListApi } from "@/lib/http/services/post";
import { toast } from "sonner";
/**
 * 帖子列表
 */
export const PostList = (props: IPostListProps) => {
    const { } = props;

    const [dataSource, setDataSource] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10
    });

    /**
     * 获取数据源
     */
    const getDataSource = async () => {
        try {
            setLoading(true);
            const response = await getPostListApi({
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize
            });
            if (response.success) {
                setDataSource(prev => [...prev, ...response.data.list]);
            } else {
                toast.error(response.message || '获取失败')
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDataSource();
    }, [pagination])

    return <div className="w-full h-full overflow-scroll">
        <Suspense fallback={<div>loading</div>}>
            {
                dataSource?.map(post => {
                    return <div className="flex gap-2 border-b-1 p-4" key={post.id}>
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
                                        <span>
                                            ·
                                        </span>
                                        <span className="text-[14px]">
                                            {
                                                new Date(post?.createdAt).toLocaleDateString()
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="mb-2 text-[#0F1419] whitespace-pre-wrap break-words overflow-hidden"
                                style={{
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 5,
                                    wordBreak: 'break-all',
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                {post.content}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 cursor-pointer text-[#536471] hover:text-[#1D9BF0] transition-colors">
                                    <MessageCircle className="w-[35px] h-[35px] text-current transition-colors hover:bg-[#E8F5FD] p-2 rounded-full" />
                                    <span>{post.repliesCount}</span>
                                </div>
                                <div className="flex items-center gap-1 w-[114px] cursor-pointer text-[#536471] hover:text-[#00BA7C] transition-colors">
                                    <Repeat2 className="w-[35px] h-[35px] text-current transition-colors hover:bg-[#00ba7c1a] p-2 rounded-full" />
                                    <span>
                                        {post.retweetsCount}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 w-[114px] cursor-pointer text-[#536471] hover:text-[#F91880] transition-colors">
                                    <Heart className="w-[35px] h-[35px] text-current transition-colors hover:bg-[#f918801a] p-2 rounded-full" />
                                    <span >
                                        {post.likesCount}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 w-[114px] cursor-pointer text-[#536471] hover:text-[#1D9BF0] transition-colors">
                                    <ChartNoAxesColumnIncreasing className="w-[35px] h-[35px] text-current transition-colors hover:bg-[#E8F5FD] p-2 rounded-full" />
                                    <span>
                                        {post.bookmarksCount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                })
            }
        </Suspense>
    </div>
}