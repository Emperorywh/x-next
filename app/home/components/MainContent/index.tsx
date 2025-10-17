'use client';
import { ComposePost } from "@/components/features/ComposePost";
import { useState } from "react"

export default function MainContent() {
    const [tabValue, setTabValue] = useState<'recommend' | 'focus'>('recommend');
    return <div className="w-[750px] box-border flex-shrink-0 border-[#EFF3F4] border-solid border">
        <div className="flex">
            <div className="w-1/2 flex justify-center cursor-pointer relative hover:bg-[#0f14191a]" onClick={() => setTabValue('recommend')}>
                <span className="flex items-center h-[53px] text-[#536471]">
                    为你推荐
                </span>
                {
                    tabValue === 'recommend' && <div className="absolute content-[''] bottom-0 h-1 w-15 bg-[#1D9BF0] rounded-full"></div>
                }
            </div>
            <div className="w-1/2 flex justify-center cursor-pointer relative hover:bg-[#0f14191a]" onClick={() => setTabValue('focus')}>
                <span className="flex items-center h-[53px] text-[#536471]">
                    关注
                </span>
                {
                    tabValue === 'focus' && <div className="absolute content-[''] bottom-0 h-1 w-8 bg-[#1D9BF0] rounded-full"></div>
                }
            </div>
        </div>
        <div className="px-2 py-2 border-[#EFF3F4] border-solid border">
            <ComposePost />
        </div>
    </div>
}