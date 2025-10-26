import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { PersonalInfomationHoverProps } from "./types"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconGork } from "../Icon";

/**
 * 个人资料
 * @param props 
 * @returns 
 */
export const PersonalInfomationHover = (props: PersonalInfomationHoverProps) => {
    const { children, user } = props;
    return <HoverCard>
        <HoverCardTrigger asChild>
            {children}
        </HoverCardTrigger>
        <HoverCardContent className="w-[300px] h-[385px] px-5 py-3 rounded-xl box-border">
            <div className="flex items-start justify-between mb-3">
                <Image className="rounded-full" width={64} height={64} src={user.image || ''} alt={user.username} />
                <Button variant="outline" className="w-[94px] h-[36px] rounded-full flex items-center justify-center cursor-pointer">
                    正在关注
                </Button>
            </div>
            <div className="flex flex-col mb-3">
                <span className="text-black font-bold mb-3">{user.name}</span>
                <span className="text-zinc-400">@{user.username}</span>
            </div>
            <div className="mb-3">
                {user.bio}
            </div>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center">
                    <span className="font-bold mr-1">
                        {user.followingCount}
                    </span>
                    <span className="text-zinc-400">
                        正在关注
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="font-bold mr-1">
                        {user.followersCount}
                    </span>
                    <span className="text-zinc-400">
                        关注者
                    </span>
                </div>
            </div>
            <div className="flex justify-center">
                <Button className="flex items-center w-[268px] h-[36px] cursor-pointer" variant="outline">
                    <IconGork width={20} height={20} />
                    <span>个人资料概要</span>
                </Button>
            </div>
        </HoverCardContent>
    </HoverCard>
}