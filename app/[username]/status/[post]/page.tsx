import { postGetById } from "@/app/actions/post/post.action";
import NavigationBar from "@/components/features/NavigationBar";
import { PersonalInfomationHover } from "@/components/features/PersonalInfomationHover";
import Sidebar from "@/components/features/Sidebar";
import Image from "next/image";
import { PostDetailHeader } from "./PostDetailHeader";
import { PostReply } from "@/components/features/PostReply";
import { PostForward } from "@/components/features/PostForward";
import { PostLike } from "@/components/features/PostLike";
import { PostViews } from "@/components/features/PostViews";
import { Suspense } from "react";
import { PostListSkeleton } from "@/components/features/PostList/PostListSkeleton";

const AsyncPage = async ({ params }: { params: Promise<{ username: string, post: string }> }) => {
    try {
        const pageParams = await params;
        const { data: post } = await postGetById({ id: pageParams.post });
        if (!post) {
            return <PostListSkeleton />;
        }
        return <>
            <div className="flex items-center gap-3 mb-2">
                <PersonalInfomationHover user={post.author}>
                    <Image
                        width={40}
                        height={40}
                        alt={post.author.username}
                        src={post.author.image || ''}
                        className="rounded-full cursor-pointer"
                    />
                </PersonalInfomationHover>
                <PersonalInfomationHover user={post.author}>
                    <div className="flex flex-col cursor-pointer">
                        <span className="font-bold mb-0.5">
                            {post.author.name}
                        </span>
                        <span className="text-zinc-300">
                            @{post.author.username}
                        </span>
                    </div>
                </PersonalInfomationHover>
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
        </>
    } catch (error) {
        return <PostListSkeleton />;
    }
}

/**
 * 帖子详情
 * @param param0 
 * @returns 
 */
const Page = async ({ params }: { params: Promise<{ username: string, post: string }> }) => {

    return <div className="flex w-[100vw] h-[100vh] box-border overflow-hidden p-0 m-0">
        <NavigationBar />
        <div className="w-[600px] h-[100vh] overflow-hidden flex flex-col box-border flex-shrink-0 border-[#EFF3F4] border-solid border px-3">
            <PostDetailHeader />
            <Suspense fallback={<PostListSkeleton />}>
                <AsyncPage params={params} />
            </Suspense>
        </div>
        <Sidebar />
    </div>
}

export default Page;