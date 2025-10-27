'use client';
import { userGetInfoByHeader } from "@/app/actions/user/user.action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/lib/api/user/user.types";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostModal() {

    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<User>();

    const init = async () => {
        try {
            setLoading(true);
            const response = await userGetInfoByHeader();
            if (response.success) {
                setUserInfo(response.data);
            }
        } catch (error) {

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
        <DialogContent showCloseButton={false} className="max-w-[calc(100%-2rem)] sm:max-w-[600px] h-[650px] p-0 m-0">
            <DialogTitle>
                <div className="flex items-center justify-between px-6 pt-4">
                    <DialogClose>
                        <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full hover:bg-zinc-200 cursor-pointer shrink-0 mr-10">
                            <X className="w-[20px] h-[20px]" />
                        </div>
                    </DialogClose>
                    <div className="grow">
                        编辑个人资料
                    </div>
                    <Button className="shrink-0 cursor-pointer">
                        保存
                    </Button>
                </div>
            </DialogTitle>
            <DialogDescription />
            <div>
                
            </div>
        </DialogContent>
    </Dialog>
}