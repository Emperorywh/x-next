import { IPostListProps } from "./types";
import { useEffect, useState } from "react";
import { getPostListApi } from "@/lib/http/services/post";
import { toast } from "sonner";
import { Post } from "@/lib/api/post/post.types";
import { PostItem } from "./PostItem";
import { PostListSkeleton } from "./PostListSkeleton";
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
        {
            loading ? <PostListSkeleton /> : dataSource?.map(post => {
                return <PostItem post={post} key={post.id} />
            })
        }
    </div>
}