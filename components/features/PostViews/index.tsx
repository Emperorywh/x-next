import { ChartNoAxesColumnIncreasing } from "lucide-react"
import { PostViewsProps } from "./types"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * 帖子浏览量
 * @returns 
 */
export const PostViews = (props: PostViewsProps) => {
    const { post } = props;
    return <Dialog>
        <DialogTrigger asChild>
            <div className="flex items-center gap-1 w-[114px] cursor-pointer text-[#536471] hover:text-[#1D9BF0] transition-colors">
                <ChartNoAxesColumnIncreasing className="w-[35px] h-[35px] text-current transition-colors hover:bg-[#E8F5FD] p-2 rounded-full" />
                <span>{post.bookmarksCount}</span>
            </div>
        </DialogTrigger>
        <DialogContent className="w-[600px] h-[329px] flex flex-col items-center justify-center">
            <DialogHeader>
                <DialogTitle className="text-[#0f1419] font-bold mb-[8px] text-[24px]">浏览量</DialogTitle>
                <DialogDescription className="mb-[32px]">
                    <span className="text-[#536471]">
                        这个帖子被查看的次数。要了解更多信息，请访问
                    </span>
                    <span className="text-[#0f1419] border-b-1 border-black cursor-pointer">
                        帮助中心
                    </span>
                    。
                </DialogDescription>
            </DialogHeader>
            <DialogClose>
                <Button className="w-[400px] h-[52px] rounded-full cursor-pointer">忽略</Button>
            </DialogClose>
        </DialogContent>
    </Dialog>
}