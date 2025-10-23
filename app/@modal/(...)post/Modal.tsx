'use client';
import { ComposePost } from "@/components/features/ComposePost";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
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

        <DialogContent>
            <DialogTitle />
            <DialogDescription />
            <ComposePost
                onCreatePostSuccess={() => {
                    router.back();
                }}
            />
        </DialogContent>
    </Dialog>
}