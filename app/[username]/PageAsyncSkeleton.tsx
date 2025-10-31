export default function PageAsyncSkeleton() {
    return (
        <div>
            {/* UsernameHeader 骨架 */}
            <div className="px-[16px] py-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex-1">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>

            {/* 封面图片和头像区域 */}
            <div className="relative mb-[50px]">
                {/* 封面图片骨架 */}
                <div className="w-full h-[199px] bg-gray-200 animate-pulse" />
                
                {/* 头像骨架 */}
                <div className="absolute top-[130px] left-[15px] p-[5px] rounded-full bg-[#FFF]">
                    <div className="rounded-full w-[133px] h-[133px] bg-gray-200 animate-pulse" />
                </div>

                {/* 编辑按钮骨架 */}
                <div className="flex items-center justify-end mt-2 pr-3">
                    <div className="w-[124px] h-[36px] bg-gray-200 rounded-full animate-pulse" />
                </div>
            </div>

            {/* 用户信息区域 */}
            <div className="px-[16px]">
                {/* 用户名区域骨架 */}
                <div className="flex flex-col mb-3">
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* 简介骨架 */}
                <div className="mb-3 space-y-2">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* 加入日期骨架 */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-[18px] h-[18px] bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* 关注统计骨架 */}
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}

