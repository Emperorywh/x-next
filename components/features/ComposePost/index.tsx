'use client';
import Image from 'next/image'
import { ComposePostProps } from "./types";
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AtSign, Check, ChevronDown, Earth, ImagePlus, ShieldCheck, Smile, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmojiPickerCustomer } from '../EmojiPickerCustomer';
import { ChangeEvent, useRef, useState } from 'react';
import { toast } from 'sonner';
import { createPostApi } from '@/lib/http/services/post';
import { getUploadResultUrl, uploadFileUrl } from '@/lib/http/services/minio';
import { uploadFile } from '@/lib/utils/uploadFile';

/**
 * 撰写帖子
 */
export function ComposePost(props: ComposePostProps) {
    const { onCreatePostSuccess } = props;
    const [postContent, setPostContent] = useState('');
    const [loading, setLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const inputFileRef = useRef<HTMLInputElement>(null);

    /**
     * 选择文件
     * @param event 
     */
    const onInputFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            setLoading(true);
            const fileList = event.target.files;
            if (!fileList?.length) {
                return;
            }
            const selectedFiles = Array.from(fileList);
            const hasInvalidFile = selectedFiles.some(fileItem => {
                const isImageFile = fileItem.type?.startsWith('image/');
                const isVideoFile = fileItem.type?.startsWith('video/');
                return !isImageFile && !isVideoFile;
            });
            if (hasInvalidFile) {
                toast.error("仅支持上传图片或视频文件");
                event.target.value = "";
                return;
            }
            const presignedUrlArray: string[] = [];
            for (let i = 0; i < selectedFiles.length; i++) {
                const currentFile = selectedFiles[i];
                const response = await uploadFileUrl({
                    objectName: currentFile.name
                });
                if (response.success && response?.data?.presignedUrl) {
                    await uploadFile({
                        url: response?.data?.presignedUrl,
                        file: currentFile,
                        method: 'PUT'
                    });
                    const responsePreview = await getUploadResultUrl({ objectName: currentFile.name });
                    if (responsePreview.success && responsePreview?.data?.presignedUrl) {
                        presignedUrlArray.push(responsePreview?.data?.presignedUrl);
                    }
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const handlePost = async () => {
        try {
            const value = textareaRef.current?.value;
            if (!value) {
                toast.error("请输入帖子内容");
                return;
            }
            setLoading(true);
            const response = await createPostApi({
                content: value
            });
            if (response.success) {
                toast.success('发帖成功');
                setPostContent('');
                onCreatePostSuccess?.();
            } else {
                toast.error(response?.message || '发帖失败，请稍后重试');
            }
        } catch (error) {
            toast.error(JSON.stringify(error))
        } finally {
            setLoading(false);
        }
    }

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
                <PopoverContent>
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
                className="mb-3 leading-[28px] focus-visible:ring-0 focus-visible:ring-offset-0 focus:shadow-none shadow-none border-0 outline-none resize-none bg-transparent font-bold w-full"
                rows={3}
                value={postContent}
                onChange={event => setPostContent(event.target.value)}
                ref={textareaRef}
                wrap="hard"
                style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                }}
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
            <hr className="border-t border-gray-300 mb-5 mt-1" />
            <div className="flex items-center justify-between">
                <div className='flex gap-2'>
                    <div className="w-[40px] h-[40px] hover:bg-[#e8f5fd] rounded-full flex items-center justify-center cursor-pointer" onClick={() => inputFileRef?.current?.click()}>
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
                <Button className="cursor-pointer rounded-full px-6" onClick={handlePost}>
                    {
                        loading ? '发贴中...' : '发帖'
                    }
                </Button>
            </div>
        </div>
        <input
            type="file"
            accept="image/*,video/*"
            multiple
            style={{ display: 'none' }}
            ref={inputFileRef}
            onChange={onInputFileChange}
        />
    </div >
}