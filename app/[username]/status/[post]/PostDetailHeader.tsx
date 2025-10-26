'use client';

import { MoveLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export const PostDetailHeader = () => {
    const router = useRouter()
    return <div className="flex items-center gap-6 h-[53px] box-border cursor-pointer" onClick={() => router.back()}>
        <div className="hover:bg-zinc-200 rounded-full p-2 cursor-pointer">
            <MoveLeft width={20} height={20} />
        </div>
        <span>
            帖子
        </span>
    </div>
}
