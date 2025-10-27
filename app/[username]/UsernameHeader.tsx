'use client';

import { User } from "@/lib/api/user/user.types";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export interface UsernameHeaderProps {
    user: User
}

export const UsernameHeader = (props: UsernameHeaderProps) => {
    const { user } = props;
    const router = useRouter();
    return <div className="flex items-center gap-6 h-[53px] box-border cursor-pointer" onClick={() => router.back()}>
        <div className="hover:bg-zinc-200 rounded-full p-2 cursor-pointer">
            <MoveLeft width={20} height={20} />
        </div>
        {
            user?.name && <span>
                {
                    user?.name
                }
            </span>
        }
    </div>
}
