/**
 * 加载状态组件 - 骨架屏
 * 提供更好的加载体验和视觉效果
 */
export const PostListSkeleton = ({ count = 5 }: { count?: number }) => (
    <div className="w-full">
        {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="flex gap-3 border-b border-gray-200 p-4 animate-pulse">
                {/* 头像骨架 */}
                <div className="shrink-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>

                {/* 内容骨架 */}
                <div className="flex-1 space-y-3">
                    {/* 用户信息骨架 */}
                    <div className="flex items-center gap-2">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>

                    {/* 帖子内容骨架 */}
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                    </div>

                    {/* 交互按钮骨架 */}
                    <div className="flex items-center justify-between max-w-md">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-6"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-6"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-6"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-6"></div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);