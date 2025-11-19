'use client';
import { IconGork } from "@/components/features/Icon";
import NavigationBar from "@/components/features/NavigationBar";
import { Textarea } from "@/components/ui/textarea";
import { Maximize, History, Paperclip, MoveUp } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

/**
 * Grok
 * @returns 
 */
export default function Page() {

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [messageList, setMessageList] = useState<{ id: string, message: string, fromType: 'ai' | 'user' }[]>([]);

    const onSendMessage = () => {
        if (!textareaRef?.current) return;
        const value = textareaRef.current?.value;
        if (!value) {
            toast.info("请输入内容");
            return;
        }
        setMessageList(prev => [...prev, {
            id: Date.now().toString(),
            message: value,
            fromType: 'user'
        }]);
        textareaRef.current.value = '';
    }

    return <div className="flex w-[100vw] h-[100vh] box-border overflow-hidden p-0 m-0">
        <NavigationBar />
        <div className="grow h-[100vh] overflow-hidden flex flex-col box-border flex-shrink-0 border-[#EFF3F4] border-solid border">
            <div className="w-[800px] h-[100%] flex flex-col">
                <div className="shrink-0 flex justify-between items-center h-[50px] px-5">
                    <div className="cursor-pointer hover:bg-zinc-200 p-2 rounded-md">
                        <Maximize width={20} height={20} />
                    </div>
                    <div className="cursor-pointer hover:bg-zinc-200 py-1 px-3 rounded-md flex items-center gap-1">
                        <History width={16} height={16} />
                        <span className="text-xs">历史</span>
                    </div>
                </div>
                {
                    messageList.length > 0 ? <div className="grow overflow-auto px-10 py-5">
                        {
                            messageList.map((item) => {
                                const isAi = item.fromType === 'ai';
                                if (isAi) {
                                    return <div key={item.id} className="mb-5">
                                        {item.message}
                                    </div>
                                } else {
                                    return <div key={item.id} className="flex justify-end">
                                        <div className="bg-gray-200 p-5 rounded-2xl w-[50vw] mb-3">
                                            {item.message}
                                        </div>
                                    </div>
                                }
                            })
                        }
                    </div> : <div className="h-[40%]"></div>
                }
                <div className="shrink-0 flex flex-col items-center">
                    <div className="flex items-center justify-center gap-2 h-[50px] cursor-pointer mb-2">
                        <IconGork width={36} height={36} />
                        <span className="font-bold text-2xl">Grok</span>
                    </div>
                    <div className="relative flex justify-center w-[768px] box-border px-3 py-3 border-zinc-200 border-1 rounded-4xl">
                        <div className="w-[33px] h-[33px] rounded-full hover:bg-zinc-100 flex items-center justify-center cursor-pointer absolute bottom-3 left-3">
                            <Paperclip className="shrink-0" width={16} height={16} />
                        </div>
                        <Textarea ref={textareaRef} rows={1} className="border-none outline-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none max-h-[300px] w-[670px] min-h-0" placeholder="随便问点什么" />
                        <div onClick={onSendMessage} className="w-[33px] h-[33px] rounded-full bg-black flex items-center justify-center cursor-pointer  absolute bottom-3 right-3">
                            <MoveUp className="text-[#FFF]" width={16} height={16} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}