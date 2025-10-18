"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { loginApi } from "@/lib/http/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    username: z
        .string()
        .optional()
        .refine(
            (val) => !val || (val.length >= 3 && val.length <= 20 && /^[a-zA-Z0-9_]+$/.test(val)),
            { message: "用户名至少需要3个字符，最多20个字符，只能包含字母、数字和下划线" }
        ),
    phoneNumber: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^1[3-9]\d{9}$/.test(val),
            { message: "请输入正确的手机号格式" }
        ),
    email: z
        .string()
        .optional()
        .refine(
            (val) => !val || z.string().email().safeParse(val).success,
            { message: "邮箱格式错误" }
        ),
    password: z
        .string()
        .min(8, "密码至少需要8个字符")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "密码必须包含大小写字母和数字"),
}).refine(
    (data) => data.email || data.phoneNumber || data.username,
    {
        message: "请至少输入用户名、手机号或邮箱中的一种",
        path: ["username"]
    }
);

/**
 * 登录弹窗
 * @returns 
 */
export function DialogLogin() {

    const router = useRouter();

    const [tabValue, setTabValue] = useState('email');

    const [loginLoading, setLoginLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            username: '',
            phoneNumber: '',
            password: ''
        }
    });

    async function handleSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoginLoading(true);
            const response = await loginApi(values);
            if (response.success) {
                toast.success("登录成功");
                if (response?.data?.user) {
                    localStorage.setItem('LOGIN_USER', JSON.stringify(response?.data?.user));
                }
                if (response?.data?.refreshToken) {
                    localStorage.setItem('REFRESH_TOKEN', response.data.refreshToken);
                     document.cookie = `accessToken=${response.data.token}; path=/; secure; samesite=strict`;
                }
                if (response?.data?.token) {
                    localStorage.setItem('TOKEN', response.data.token);
                     document.cookie = `refreshToken=${response.data.refreshToken}; path=/; secure; samesite=strict; httponly`;
                }
                router.push("/home");
            } else {
                toast.error(response?.message);
            }
        } catch (error) {
            toast.error("系统错误，请稍后重试" + JSON.stringify(error));
        } finally {
            setLoginLoading(false);
        }
    }

    return <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" className="my-5 font-bold rounded-full w-[300] h-[40] cursor-pointer ">
                登录
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>
                    登录 X Next
                </DialogTitle>
            </DialogHeader>
            <div className="p-8">
                <div className="flex flex-col items-center">
                    <Button variant="outline" className="my-2 rounded-full w-[300] h-[40] cursor-pointer grid grid-flow-col gap-x-3">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ width: 18, height: 18 }}><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
                        <span>使用 Google 账号登录</span>
                    </Button>
                    <Button variant="outline" className="my-2 rounded-full w-[300] h-[40] cursor-pointer grid grid-flow-col gap-x-3">
                        <svg height="32" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="32" data-view-component="true" style={{ width: 18, height: 18 }}>
                            <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
                        </svg>
                        <span>使用 Github 账号登录</span>
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-gray-500 w-[300]">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="text-black">或</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <Tabs className="w-[300]" value={tabValue} onValueChange={setTabValue}>
                                <TabsList defaultValue="email" className="mb-2">
                                    <TabsTrigger value="email">
                                        电子邮件
                                    </TabsTrigger>
                                    <TabsTrigger value="phoneNumber">
                                        电话号码
                                    </TabsTrigger>
                                    <TabsTrigger value="username">
                                        用户名
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="email">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>邮箱</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="请输入邮箱" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                                <TabsContent value="phoneNumber">
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>电话</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="请输入电话" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                                <TabsContent value="username">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>用户名</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="请输入用户名" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                            </Tabs>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="mt-5 mb-5">
                                        <FormLabel>密码</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="请输入密码" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="button" variant="outline">忘记密码？</Button>
                                <Button type="submit" disabled={loginLoading}>
                                    {
                                        loginLoading ? '登录中' : '登录'
                                    }
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </div>
        </DialogContent>
    </Dialog>
}