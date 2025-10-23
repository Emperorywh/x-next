import { IconBookMarks, IconCommunitity, IconGork, IconHome, IconList, IconMessage, IconMore, IconNotification, IconPersonal, IconPost, IconSearch, IconX } from "@/components/features/Icon";

export default function NavigationBar() {
    return <div className="grow shrink-0 overflow-hidden flex justify-end ">
        <div className="w-[275px] box-border">
            <div className="w-[259px] cursor-pointer">
                <div className="inline-flex items-center p-5 gap-5 hover:bg-gray-200 rounded-full">
                    <IconX />
                </div>
            </div>
            <div className="w-[259px] cursor-pointer">
                <div className="h-[50px] inline-flex items-center px-5 gap-5 hover:bg-gray-200 rounded-full">
                    <IconHome />
                    <span className="text-[16px] font-medium">
                        主页
                    </span>
                </div>
            </div>
            <div className="w-[259px] cursor-pointer">
                <div className="h-[50px] inline-flex items-center px-5 gap-5 hover:bg-gray-200 rounded-full">
                    <IconSearch />
                    <span>
                        探索
                    </span>
                </div>
            </div>
            <div className="w-[259px] cursor-pointer">
                <div className="h-[50px] inline-flex items-center px-5 gap-5 hover:bg-gray-200 rounded-full">
                    <IconNotification />
                    <span>
                        通知
                    </span>
                </div>
            </div>
            <div className="w-[259px] cursor-pointer">
                <div className="h-[50px] inline-flex items-center px-5 gap-5 hover:bg-gray-200 rounded-full">
                    <IconMessage />
                    <span>
                        私信
                    </span>
                </div>
            </div>
            <div className="w-[259px] cursor-pointer">
                <div className="h-[50px] inline-flex items-center px-5 gap-5 hover:bg-gray-200 rounded-full">
                    <IconGork />
                    <span>
                        Grok
                    </span>
                </div>
            </div>
            <div className="w-[259px] cursor-pointer">
                <div className="h-[50px] inline-flex items-center px-5 gap-5 hover:bg-gray-200 rounded-full">
                    <IconList />
                    <span>
                        列表
                    </span>
                </div>
            </div>
            <div className="w-[259px] cursor-pointer">
                <div className="h-[50px] inline-flex items-center px-5 gap-5 hover:bg-gray-200 rounded-full">
                    <IconBookMarks />
                    <span>
                        书签
                    </span>
                </div>
            </div>
            <div className="w-[259px] cursor-pointer">
                <div className="h-[50px] inline-flex items-center px-5 gap-5 hover:bg-gray-200 rounded-full">
                    <IconCommunitity />
                    <span>
                        社群
                    </span>
                </div>
            </div>
            <div className="w-[259px] cursor-pointer">
                <div className="h-[50px] inline-flex items-center px-5 gap-5 hover:bg-gray-200 rounded-full">
                    <IconPersonal />
                    <span>
                        个人资料
                    </span>
                </div>
            </div>
            <div className="w-[259px] cursor-pointer">
                <div className="h-[50px] inline-flex items-center px-5 gap-5 hover:bg-gray-200 rounded-full">
                    <IconMore />
                    <span>
                        更多
                    </span>
                </div>
            </div>
            <div className="w-[259px] cursor-pointer">
                <div className="h-[50px] inline-flex items-center px-5 gap-5 hover:bg-gray-200 rounded-full">
                    <IconPost />
                    <span>
                        发帖
                    </span>
                </div>
            </div>
        </div>
    </div>
}