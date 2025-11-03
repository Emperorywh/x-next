'use client';
import { userGetInfoByHeader, userUpdateInfo } from "@/app/actions/user/user.action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/lib/api/user/user.types";
import { ChevronRight, ImageUp, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Input } from "@/components/ui/input";
import ModalSkeleton from "./ModalSkeleton";
import { getUploadResultUrl, uploadFileUrl } from "@/lib/http/services/minio";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "名称至少两位",
    }),
    bio: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional()
})

export default function PostModal() {

    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<User>();

    const inputRef = useRef<HTMLInputElement>(null);

    const uploadType = useRef<'cover' | 'image' | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const init = async () => {
        try {
            setLoading(true);
            const response = await userGetInfoByHeader();
            if (response.success) {
                setUserInfo(response.data);
                form.reset(response.data as unknown as z.infer<typeof formSchema>)
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }

    }

    /**
     * 选择文件
     * @param event 
     */
    const onInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            setLoading(true);
            const fileList = event.target.files;
            if (!fileList?.length) {
                return;
            }
            const selectedFile = fileList[0];
            if (!selectedFile.type?.startsWith('image/')) {
                toast.error("请上传图片文件");
                event.target.value = "";
                return;
            }
            const fileName = selectedFile.name;
            const response = await uploadFileUrl({
                objectName: fileName
            });
            if (response.success && response.data?.presignedUrl) {
                await uploadFileToMinIO(selectedFile, response.data?.presignedUrl);
                const responsePreview = await getUploadResultUrl({ objectName: fileName });
                if (responsePreview.success && responsePreview?.data?.presignedUrl) {
                    if (!userInfo) return;
                    const presignedUrl = responsePreview?.data?.presignedUrl;
                    const cloneUser = structuredClone(userInfo);
                    if (uploadType.current === 'cover') {
                        cloneUser.coverImage = presignedUrl;
                    } else if (uploadType.current === 'image') {
                        cloneUser.image = presignedUrl;
                    }
                    setUserInfo(cloneUser);
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    const uploadFileToMinIO = (file: any, presignedUrl: string, onProgress?: any) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // 监听上传进度
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    onProgress?.(percentComplete);
                }
            });

            // 监听完成
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`));
                }
            });

            // 监听错误
            xhr.addEventListener('error', () => {
                reject(new Error('上传过程中发生网络错误'));
            });

            // 发送请求
            xhr.open('PUT', presignedUrl);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file);
        });
    }

    /**
     * 提交表单
     * @param values 
     */
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            if (!userInfo) return;
            const response = await userUpdateInfo({
                name: values.name,
                bio: values.bio,
                location: values.location,
                website: values.website,
                birthDate: userInfo.birthDate?.toISOString() || '',
                image: userInfo?.image || '',
                coverImage: userInfo?.coverImage || ''
            });
            if (response.success) {
                toast.success("更新成功");
                setUserInfo(response.data)
                setOpen(false);
                router.back();
                setTimeout(() => { router.refresh() }, 100)
            } else {
                toast.error(response?.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!open) {
            setOpen(true);
        }
    }, []);

    useEffect(() => {
        if (open) {
            init();
        }
    }, [open])

    return <Dialog
        open={open}
        onOpenChange={value => {
            setOpen(value);
            if (!value) {
                router.back();
            }
        }}
    >
        <DialogContent
            showCloseButton={false}
            className="max-w-[calc(100%-2rem)] sm:max-w-[600px] h-[650px] p-0 m-0 overflow-auto"
            aria-describedby={undefined}
        >
            <VisuallyHidden asChild>
                <DialogTitle>
                </DialogTitle>
            </VisuallyHidden>
            {loading ? (
                <ModalSkeleton />
            ) : (
                <div>
                    <div className="flex items-center justify-between px-6 h-[50px] overflow-hidden sticky top-0 z-999 bg-[#ffffffd9] backdrop-blur-sm">
                        <DialogClose>
                            <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full hover:bg-zinc-200 cursor-pointer shrink-0 mr-10">
                                <X className="w-[20px] h-[20px]" />
                            </div>
                        </DialogClose>
                        <div className="grow font-bold">
                            编辑个人资料
                        </div>
                        <Button
                            className="shrink-0 cursor-pointer rounded-full"
                            onClick={async () => {
                                const validate = await form.trigger();
                                if (!validate) return;
                                const values = form.getValues();
                                onSubmit(values);
                            }}
                        >
                            保存
                        </Button>
                    </div>
                    {
                        userInfo && <div className="relative">
                            <div className="relative">
                                <div className="relative">
                                    <Image
                                        src={userInfo?.coverImage || ''}
                                        alt="背景图片"
                                        width={599}
                                        height={199}
                                        className="w-[599px] h-[199px]"
                                    />
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <div className="flex items-center gap-3">
                                            <div
                                                onClick={() => {
                                                    uploadType.current = 'cover';
                                                    inputRef.current?.click();
                                                }}
                                                className="bg-[#0f1419bf] hover:bg-[#272c30bf] p-2 rounded-full w-[42px] h-[42px] flex items-center justify-center cursor-pointer">
                                                <ImageUp className="text-[#FFF] w-[22px] h-[22px]" />
                                            </div>
                                            <div className="bg-[#0f1419bf] hover:bg-[#272c30bf] p-2 rounded-full w-[42px] h-[42px] flex items-center justify-center cursor-pointer">
                                                <X className="text-[#FFF]  w-[22px] h-[22px]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-[130px] left-[15px] p-[5px] rounded-full bg-[#FFF]">
                                    <div className="relative">
                                        <Image
                                            src={userInfo?.image || ''}
                                            alt="头像"
                                            width={133}
                                            height={133}
                                            className="rounded-full  w-[133px] h-[133px]"
                                        />
                                        <div className="bg-black rounded-full  w-[133px] h-[133px] absolute opacity-40 top-0 left-0"></div>
                                        <div onClick={() => {
                                            uploadType.current = 'image';
                                            inputRef.current?.click();
                                        }} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                            <div className=" bg-[#0f1419bf] hover:bg-[#272c30bf] p-2 rounded-full w-[42px] h-[42px] flex items-center justify-center cursor-pointer">
                                                <ImageUp className="text-[#FFF] w-[22px] h-[22px]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-20 px-5">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>全名</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="请输入全名" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bio"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>简介</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="请输入简介" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>位置</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="请输入位置" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="website"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>网站</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="请输入网站" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </form>
                                </Form>
                            </div>
                            <div className="flex items-center justify-between p-5 hover:bg-[#f7f9f9] cursor-pointer my-5">
                                <div className="grow">
                                    <div>
                                        出生日期
                                    </div>
                                    <div>
                                        {new Date(userInfo?.birthDate || '').toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    <ChevronRight className="w-[18px] h-[18px]" />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={inputRef}
                onChange={onInputChange}
            />
        </DialogContent>
    </Dialog>
}