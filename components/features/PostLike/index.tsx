import { Heart } from "lucide-react"
import { PostLikeProps } from "./types"

/**
 * 帖子 点赞
 * @returns 
 */
export const PostLike = (props: PostLikeProps) => {
    const { post } = props;
    return <div className="flex items-center gap-1 w-[114px] cursor-pointer text-[#536471] hover:text-[#F91880] transition-colors">
        <Heart className="w-[35px] h-[35px] text-current transition-colors hover:bg-[#f918801a] p-2 rounded-full" />
        <span>{post.likesCount}</span>
    </div>
}