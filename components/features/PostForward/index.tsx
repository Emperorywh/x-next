import { PencilLine, Repeat2 } from "lucide-react"
import { PostForwardProps } from "./types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * 转发帖子
 * @returns 
 */
export const PostForward = (props: PostForwardProps) => {
    const { post } = props;
    return <Popover>
        <PopoverTrigger asChild>
            <div className="flex items-center gap-1 w-[114px] cursor-pointer text-[#536471] hover:text-[#00BA7C] transition-colors">
                <Repeat2 className="w-[35px] h-[35px] text-current transition-colors hover:bg-[#00ba7c1a] p-2 rounded-full" />
                <span>{post.retweetsCount}</span>
            </div>
        </PopoverTrigger>
        <PopoverContent className="w-[92px] rounded-xl overflow-hidden m-0 p-0">
            <div className="flex items-center justify-center gap-4 h-[45px] cursor-pointer hover:bg-[#00000008]">
                <Repeat2 className="w-[18px] h-[18px]" />
                <span className="text-[#0f1419] text-[14px]">转帖</span>
            </div>
            <div className="flex items-center justify-center gap-4 h-[45px] cursor-pointer hover:bg-[#00000008]">
                <PencilLine className="w-[18px] h-[18px]" />
                <span className="text-[#0f1419] text-[14px]">引用</span>
            </div>
        </PopoverContent>
    </Popover>
}