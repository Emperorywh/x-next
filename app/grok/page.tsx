import { IconGork } from "@/components/features/Icon";
import NavigationBar from "@/components/features/NavigationBar";
import { Textarea } from "@/components/ui/textarea";
import { Maximize, History, Paperclip, MoveUp } from "lucide-react";

/**
 * Grok
 * @returns 
 */
export default function Page() {
    return <div className="flex w-[100vw] h-[100vh] box-border overflow-hidden p-0 m-0">
        <NavigationBar />
        <div className="grow h-[100vh] overflow-hidden flex flex-col box-border flex-shrink-0 border-[#EFF3F4] border-solid border">
            <div className="shrink-0 flex justify-between items-center h-[50px] px-5">
                <div className="cursor-pointer hover:bg-zinc-200 p-2 rounded-md">
                    <Maximize width={20} height={20} />
                </div>
                <div className="cursor-pointer hover:bg-zinc-200 py-1 px-3 rounded-md flex items-center gap-1">
                    <History width={16} height={16} />
                    <span className="text-xs">历史</span>
                </div>
            </div>
            <div className="grow overflow-auto flex items-center justify-center">
                <div>
                    <div className="flex items-center justify-center gap-2 h-[50px] cursor-pointer mb-2">
                        <IconGork width={36} height={36} />
                        <span className="font-bold text-2xl">Grok</span>
                    </div>
                    <div className="w-[768px] box-border px-3 py-3 border-zinc-200 border-1 rounded-xl">
                        <Textarea className="border-none outline-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none  max-h-[300px]" placeholder="随便问点什么" />
                        <div className="flex items-center justify-end gap-3">
                            <div className="w-[33px] h-[33px] rounded-full hover:bg-zinc-100 flex items-center justify-center cursor-pointer">
                                <Paperclip className="shrink-0" width={16} height={16} />
                            </div>
                            <div className="w-[33px] h-[33px] rounded-full bg-black flex items-center justify-center cursor-pointer">
                                <MoveUp className="text-[#FFF]" width={16} height={16} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
}