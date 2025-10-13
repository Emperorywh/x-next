"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zhCN } from "date-fns/locale";
import { LogoIcon } from "@/components/templates";

const FormSchema = z.object({
    username: z.string().min(6, { message: "用户名至少要6位字符" }),
    phoneNumber: z.string().optional().refine(
        (val) => !val || /^1[3-9]\d{9}$/.test(val),
        { message: "请输入正确的手机号格式" }
    ),
    email: z.string().email({ message: "邮箱格式错误" }),
    code: z.string().regex(/^\d{6}$/, "验证码必须是6位数字"),
    birthday: z.date({ error: "生日是必填项" })
})


export function CreateAccount() {


    const [open, setOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: { username: "", phoneNumber: "", email: "", birthday: undefined, code: '' },
    });


    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("提交数据:", data);
        setOpen(false);
    }

    useEffect(() => {
        if (!open) form.reset();
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="my-5 rounded-full w-[300px] h-[40px] cursor-pointer">创建账号</Button>
            </DialogTrigger>

            <DialogContent className="w-[500px] p-10">
                <DialogHeader className="grid grid-flow-col items-center mb-5">
                    <LogoIcon width={38} height={38} className="col-span-1" />
                    <DialogTitle className="col-span-2">创建你的账号</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        {/* 用户名 */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="mb-5">
                                    <FormLabel className="mb-1 font-medium">用户名</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="请输入用户名"
                                            {...field}
                                            onBlur={async () => {
                                                await form.trigger("username");
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem className="mb-5">
                                    <FormLabel className="mb-1 font-medium">手机</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="请输入手机号"
                                            {...field}
                                            onBlur={async () => {
                                                await form.trigger("phoneNumber");
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="mb-5">
                                    <FormLabel className="mb-1 font-medium">邮箱</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input
                                                placeholder="请输入邮箱"
                                                {...field}
                                                onBlur={async () => {
                                                    await form.trigger("email");
                                                }}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={async () => {
                                                // 触发邮箱字段的校验
                                                const isValid = await form.trigger("email");
                                                if (isValid) {
                                                    console.log("邮箱格式正确，可以发送验证码");
                                                }
                                            }}
                                        >
                                            获取验证码
                                        </Button>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem className="mb-5">
                                    <FormLabel className="mb-1 font-medium">验证码</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="请输入验证码"
                                            {...field}
                                            onBlur={async () => {
                                                await form.trigger("code");
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* 出生日期 */}
                        <FormField
                            control={form.control}
                            name="birthday"
                            render={({ field }) => (
                                <FormItem className="flex flex-col mb-5">
                                    <FormLabel className="mb-1 font-medium">出生日期</FormLabel>
                                    <FormDescription className="mb-1">
                                        这不会公开显示。确认你自己的年龄，即使此账号是用于业务、宠物或其他内容的。
                                    </FormDescription>

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? format(field.value, "yyyy/MM/dd") : <span>请选择日期</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                captionLayout="dropdown"
                                                locale={zhCN}
                                                style={{ width: "100%" }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-5">
                            <DialogClose asChild>
                                <Button variant="outline">取消</Button>
                            </DialogClose>
                            <Button type="submit">确定</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
