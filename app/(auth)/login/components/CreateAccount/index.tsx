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
import { SendVerificationCodeRequest } from "@/lib/http/services/email/types";
import { sendVerificationCodeApi } from "@/lib/http/services/email";
import { RegisterRequest } from "@/lib/http/services/auth/types";
import { registerApi } from "@/lib/http/services/auth";
import { toast } from "sonner"

const FormSchema = z.object({
    username: z
        .string()
        .min(3, "用户名至少需要3个字符")
        .max(20, "用户名不能超过20个字符")
        .regex(/^[a-zA-Z0-9_]+$/, "用户名只能包含字母、数字和下划线"),
    phoneNumber: z.string().optional().refine(
        (val) => !val || /^1[3-9]\d{9}$/.test(val),
        { message: "请输入正确的手机号格式" }
    ),
    email: z.string().email({ message: "邮箱格式错误" }),
    code: z.string().length(6, "验证码必须是6位数字"),
    birthday: z.date({ error: "生日是必填项" }),
    password: z
        .string()
        .min(8, "密码至少需要8个字符")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "密码必须包含大小写字母和数字"),
    confirmPassword: z
        .string()
        .min(8, "密码至少需要8个字符")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "密码必须包含大小写字母和数字"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "两次密码不一致",
    path: ["confirmPassword"],
})


export function CreateAccount() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: { username: "", phoneNumber: "", email: "", birthday: undefined, code: '', password: '', confirmPassword: '' },
    });

    // 发送验证码
    const sendVerificationCode = async (email: string) => {
        setIsSendingCode(true);
        try {
            const requestData: SendVerificationCodeRequest = { email };
            const response = await sendVerificationCodeApi(requestData);
            if (response.success) {
                setCodeSent(true);
                toast.success(response?.message);
            } else {
                toast.error(response?.message);
            }
        } catch (error: any) {
            form.setError('email', { message: error.message || '发送验证码失败' });
        } finally {
            setIsSendingCode(false);
        }
    };

    // 注册用户
    const registerUser = async (data: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        try {
            // 转换数据格式以匹配后端 API
            const registerData: RegisterRequest = {
                username: data.username,
                email: data.email,
                phoneNumber: data.phoneNumber || undefined,
                password: data.password,
                birthDate: data.birthday.toISOString(),
                code: data.code,
            };

            const response = await registerApi(registerData);

            if (response.success) {
                setOpen(false);
                toast.success("注册成功");
            } else {
                toast.error(response?.message);
            }
        } catch (error: any) {
            form.setError('root', { message: error.message || '注册失败' });
        } finally {
            setIsLoading(false);
        }
    };

    function onSubmit(data: z.infer<typeof FormSchema>) {
        registerUser(data);
    }

    /**
     * 初始化
     */
    function resetStatus() {
        form.reset();
        setCodeSent(false);
        setIsLoading(false);
        setIsSendingCode(false);
    }

    useEffect(() => {
        resetStatus();
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
                                            disabled={isSendingCode || codeSent}
                                            onClick={async () => {
                                                // 触发邮箱字段的校验
                                                const isValid = await form.trigger("email");
                                                if (isValid) {
                                                    await sendVerificationCode(field.value);
                                                }
                                            }}
                                        >
                                            {isSendingCode ? '发送中...' : '获取验证码'}
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="mb-5">
                                    <FormLabel className="mb-1 font-medium">密码</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="请输入密码"
                                            {...field}
                                            onBlur={async () => {
                                                await form.trigger("password");
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="mb-5">
                                    <FormLabel className="mb-1 font-medium">确认密码</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="请再次输入密码"
                                            {...field}
                                            onBlur={async () => {
                                                await form.trigger("confirmPassword");
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

                        {/* 显示全局错误信息 */}
                        {form.formState.errors.root && (
                            <div className="text-red-500 text-sm mb-4">
                                {form.formState.errors.root.message}
                            </div>
                        )}

                        <DialogFooter className="mt-5">
                            <DialogClose asChild>
                                <Button variant="outline" disabled={isLoading}>取消</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? '注册中...' : '确定'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
