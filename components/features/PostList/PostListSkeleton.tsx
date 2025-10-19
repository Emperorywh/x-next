/**
 * 加载状态组件 - 骨架屏
 */
export const PostListSkeleton = () => (
    <div className="w-full h-full overflow-scroll">
        {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex gap-2 border-b-1 p-4 animate-pulse">
                <div className="shrink-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                </div>
                <div className="grow">
                    <div className="mb-2">
                        <div className="flex items-center gap-3">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-6"></div>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-6"></div>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-6"></div>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-6"></div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);