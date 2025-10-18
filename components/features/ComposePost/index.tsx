import Image from 'next/image'
import { ComposePostProps } from "./types";
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AtSign, Check, ChevronDown, Earth, ImagePlus, ShieldCheck, Smile, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmojiPickerCustomer } from '../EmojiPickerCustomer';
import { useRef, useState } from 'react';


/**
 * 撰写帖子
 */
export function ComposePost(props: ComposePostProps) {
    const [postContent, setPostContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    return <div className='flex'>
        <div className="mr-5 shrink-0">
            <Image
                src="https://pbs.twimg.com/profile_images/1979028593091956736/6ix-9yak_400x400.jpg"
                alt='头像'
                width={40}
                height={40}
                className='rounded-full'
            />
        </div>
        <div className="grow">
            <Popover>
                <PopoverTrigger asChild>
                    <div className='inline-flex px-3 py-0.5 items-center gap-1 cursor-pointer border-solid border-1 rounded-full hover:bg-[#E8F5FD] mb-2'>
                        <span className="text-xs text-[#1D9BF0] font-bold">每个人</span>
                        <ChevronDown style={{ color: '#1D9BF0' }} />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="font-bold mb-2 text-xl">
                        <span>
                            选择受众
                        </span>
                    </div>
                    <div className="flex h-[80px] px-5 box-border items-center justify-between hover:bg-[#F7F9F9] rounded-[5px] cursor-pointer">
                        <div className='flex items-center gap-5'>
                            <div className='w-[50px] h-[50px] flex items-center justify-center rounded-full bg-[#1D9BF0]'>
                                <Earth style={{ color: '#FFF' }} />
                            </div>
                            <span className='text-sm font-bold'>
                                每个人
                            </span>
                        </div>
                        <Check style={{ color: '#1D9BF0' }} />
                    </div>
                </PopoverContent>
            </Popover>
            <Textarea
                placeholder="有什么新鲜事？"
                className="leading-[28px] focus-visible:ring-0 focus-visible:ring-offset-0 focus:shadow-none shadow-none border-0 outline-none resize-none bg-transparent font-bold w-full"
                rows={1}
                value={postContent}
                onChange={event => setPostContent(event.target.value)}
                ref={textareaRef}
            />
            <Popover>
                <PopoverTrigger asChild>
                    <div className='inline-flex px-3 py-0.5 items-center gap-1  rounded-full hover:bg-[#E8F5FD] mb-2 cursor-pointer'>
                        <Earth style={{ color: '#1D9BF0' }} width={16} height={16} />
                        <span className="text-xs text-[#1D9BF0] font-bold">所有人都可以回复</span>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] overflow-hidden p-0 m-0">
                    <div className="p-3">
                        <div className="font-bold mb-1">
                            所有人都可以回复
                        </div>
                        <div className="text-sm text-gray-400">
                            选择谁可以回复这个帖子。只要是提及的人就都能回复。
                        </div>
                    </div>
                    <div className="flex box-border px-3 h-[80px] items-center justify-between hover:bg-[#F7F9F9] rounded-[5px] cursor-pointer">
                        <div className='flex items-center gap-5'>
                            <div className='w-[50px] h-[50px] flex items-center justify-center rounded-full bg-[#1D9BF0]'>
                                <Earth style={{ color: '#FFF' }} width={20} height={20} />
                            </div>
                            <span className='text-sm font-bold'>
                                每个人
                            </span>
                        </div>
                        <Check style={{ color: '#1D9BF0' }} />
                    </div>
                    <div className="flex box-border px-3 h-[80px] items-center justify-between hover:bg-[#F7F9F9] rounded-[5px] cursor-pointer">
                        <div className='flex items-center gap-5'>
                            <div className='w-[50px] h-[50px] flex items-center justify-center rounded-full bg-[#1D9BF0]'>
                                <UserCheck style={{ color: '#FFF' }} width={20} height={20} />
                            </div>
                            <span className='text-sm font-bold'>
                                你关注的账号
                            </span>
                        </div>
                    </div>
                    <div className="flex box-border px-3 h-[80px] items-center justify-between hover:bg-[#F7F9F9] rounded-[5px] cursor-pointer">
                        <div className='flex items-center gap-5'>
                            <div className='w-[50px] h-[50px] flex items-center justify-center rounded-full bg-[#1D9BF0]'>
                                <ShieldCheck style={{ color: '#FFF' }} width={20} height={20} />
                            </div>
                            <span className='text-sm font-bold'>
                                认证账号
                            </span>
                        </div>
                    </div>
                    <div className="flex box-border px-3 h-[80px] items-center justify-between hover:bg-[#F7F9F9] rounded-[5px] cursor-pointer">
                        <div className='flex items-center gap-5'>
                            <div className='w-[50px] h-[50px] flex items-center justify-center rounded-full bg-[#1D9BF0]'>
                                <AtSign style={{ color: '#FFF' }} width={20} height={20} />
                            </div>
                            <span className='text-sm font-bold'>
                                只有你提及的账号
                            </span>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
            <hr className="border-t border-gray-300" />
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
                                        postContent.substring(0, start) + event.emoji + postContent.substring(end);
                                    setPostContent(newValue)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <Button className="cursor-pointer">发帖</Button>
            </div>
        </div>
    </div >
}