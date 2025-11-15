import NavigationBar from "@/components/features/NavigationBar";
import Sidebar from "@/components/features/Sidebar";
import { UsernameHeader } from "./UsernameHeader";
import { userGetInfoByUsername } from "../actions/user/user.action";
import { Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import PageAsyncSkeleton from "./PageAsyncSkeleton";
import MinioImage from "@/components/features/MinioImage";
/**
 * 个人资料
 * @returns 
 */
const Page = async ({ params, searchParams }: { params: Promise<{ username: string }>, searchParams: any }) => {
    console.log("searchParams", await searchParams)
    return <div className="flex w-[100vw] h-[100vh] box-border overflow-hidden p-0 m-0">
        <NavigationBar />
        <div className="w-[600px] h-[100vh] overflow-hidden flex flex-col box-border flex-shrink-0 border-[#EFF3F4] border-solid border">
            <Suspense fallback={<PageAsyncSkeleton />}>
                <PageAsync params={params} searchParams={searchParams} />
            </Suspense>
        </div>
        <Sidebar />
    </div>
}

const PageAsync = async ({ params }: { params: Promise<{ username: string }>, searchParams: any }) => {
    try {
        const pageParams = await params;
        const response = await userGetInfoByUsername({ username: pageParams.username });
        if (response.success) {
            return <div>
                <div className="px-[16px]">
                    <UsernameHeader user={response.data} />
                </div>
                <div className="relative mb-[50px]">
                    <MinioImage
                        objectName={response?.data?.coverImage || ''}
                        alt="背景图片"
                        width={599}
                        height={199}
                        className="w-[599px] h-[199px]"
                    />
                    <div className="absolute top-[130px] left-[15px] p-[5px] rounded-full bg-[#FFF]">
                        <MinioImage
                            objectName={response?.data?.image || ''}
                            alt="头像"
                            width={133}
                            height={133}
                            className="rounded-full  w-[133px] h-[133px]"
                        />
                    </div>
                    <div className="flex items-center justify-end mt-2 pr-3">
                        <Link href="/setting/profile">
                            <Button variant="outline" className="w-[124px] h-[36px] rounded-full text-xm cursor-pointer">
                                编辑个人资料
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="px-[16px]">
                    <div className="flex flex-col mb-3">
                        <span className="font-bold mb-0.5">
                            {response?.data?.name}
                        </span>
                        <span className="text-xm text-zinc-400">
                            @{response?.data?.username}
                        </span>
                    </div>
                    {
                        response?.data?.bio && <div className="mb-3">
                            {
                                response?.data?.bio
                            }
                        </div>
                    }

                    <div className="flex items-center gap-3 text-zinc-400 text-xm mb-3">
                        <CalendarDays width={18} hanging={18} />
                        <span>
                            {new Date(response?.data?.createdAt || '').toLocaleDateString()}
                        </span>
                        <span>
                            加入
                        </span>
                    </div>
                    <div className="flex items-center gap-5 text-xm">
                        <div className="flex items-center hover:underline cursor-pointer">
                            <span className="font-bold">
                                {response.data.followingCount}
                            </span>
                            <span className="text-zinc-400">
                                正在关注
                            </span>
                        </div>
                        <div className="flex items-center hover:underline cursor-pointer">
                            <span className="font-bold">
                                {response.data.followersCount}
                            </span>
                            <span className="text-zinc-400">
                                关注者
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        }
        return null;
    } catch (error) {
        return null;
    }

}

export default Page;