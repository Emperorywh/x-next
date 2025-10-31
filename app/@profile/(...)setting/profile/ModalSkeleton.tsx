export default function ModalSkeleton() {
    return (
        <div>
            {/* 顶部固定栏 */}
            <div className="flex items-center justify-between px-6 h-[50px] overflow-hidden sticky top-0 z-999 bg-[#ffffffd9] backdrop-blur-sm">
                <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full bg-gray-200 animate-pulse shrink-0 mr-10" />
                <div className="grow">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-9 w-16 bg-gray-200 rounded-full animate-pulse shrink-0" />
            </div>

            {/* 内容区域 */}
            <div className="relative">
                {/* 封面图片骨架 */}
                <div className="relative">
                    <div className="w-full h-[199px] bg-gray-200 animate-pulse" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="flex items-center gap-3">
                            <div className="w-[42px] h-[42px] bg-gray-300 rounded-full animate-pulse" />
                            <div className="w-[42px] h-[42px] bg-gray-300 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* 头像骨架 */}
                <div className="absolute top-[130px] left-[15px] p-[5px] rounded-full bg-[#FFF]">
                    <div className="relative">
                        <div className="rounded-full w-[133px] h-[133px] bg-gray-200 animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-[42px] h-[42px] bg-gray-300 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* 表单区域骨架 */}
                <div className="mt-20 px-5">
                    <div className="space-y-8">
                        {/* 全名字段 */}
                        <div className="space-y-2">
                            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
                        </div>

                        {/* 简介字段 */}
                        <div className="space-y-2">
                            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
                        </div>

                        {/* 位置字段 */}
                        <div className="space-y-2">
                            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
                        </div>

                        {/* 网站字段 */}
                        <div className="space-y-2">
                            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* 出生日期区域骨架 */}
                <div className="flex items-center justify-between p-5 my-5">
                    <div className="grow space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="shrink-0">
                        <div className="w-[18px] h-[18px] bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}

