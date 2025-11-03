'use client';
import { ComposePost } from "@/components/features/ComposePost";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostModal() {

    const router = useRouter();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) {
            setOpen(true);
        }
        return () => {

        }
    }, [])

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
            className="max-w-[calc(100%-2rem)] sm:max-w-[600px] px-5 pt-10 m-0 overflow-auto"
            aria-describedby={undefined}
        >
            <VisuallyHidden asChild>
                <DialogTitle>
                </DialogTitle>
            </VisuallyHidden>
            <ComposePost
                onCreatePostSuccess={() => {
                    router.back();
                }}
            />
        </DialogContent>
    </Dialog>
}