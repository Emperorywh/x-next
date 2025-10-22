'use client';
import { Textarea } from "@/components/ui/textarea";
import { ReplyTextareaProps } from "./types";
import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EmojiPickerCustomer } from "../EmojiPickerCustomer";
import { Button } from "@/components/ui/button";

export function ReplyTextarea(props: ReplyTextareaProps) {

    const [textValue, setTextValue] = useState('');

    const [loading, setLoading] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleReplay = () => {

    }

    return <div className='flex'>
        <div className="mr-1 shrink-0">
            <Image
                src="https://pbs.twimg.com/profile_images/1979028593091956736/6ix-9yak_400x400.jpg"
                alt='头像'
                width={40}
                height={40}
                className='rounded-full'
            />
        </div>
        <div className="grow">
            <Textarea
                placeholder="发布你的回复"
                className="leading-[28px] focus-visible:ring-0 focus-visible:ring-offset-0 focus:shadow-none shadow-none border-0 outline-none resize-none bg-transparent w-full"
                rows={1}
                value={textValue}
                onChange={event => setTextValue(event.target.value)}
                ref={textareaRef}
                wrap="hard"
                style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                }}
            />
            <div className="mt-2 flex items-center justify-between">
                <div className='flex gap-2'>
                    <div className="w-[40px] h-[40px] hover:bg-[#e8f5fd] rounded-full flex items-center justify-center cursor-pointer">
                        <ImagePlus width={20} height={20} style={{ color: '#1D9BF0' }} />
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="w-[40px] h-[40px] hover:bg-[#e8f5fd] rounded-full flex items-center justify-center cursor-pointer">
                                <Smile width={20} height={20} style={{ color: '#1D9BF0' }} />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 m-0">
                            <EmojiPickerCustomer
                                onEmojiClick={event => {
                                    if (!textareaRef?.current) return;
                                    const start = textareaRef.current.selectionStart;
                                    const end = textareaRef.current.selectionEnd;
                                    const newValue =
                                        textValue.substring(0, start) + event.emoji + textValue.substring(end);
                                    setTextValue(newValue)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <Button className="cursor-pointer rounded-full px-6" onClick={handleReplay}>
                    {
                        loading ? '回复中...' : '回复'
                    }
                </Button>
            </div>
        </div>
    </div>
}