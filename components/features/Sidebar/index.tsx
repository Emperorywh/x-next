import { Button } from "@/components/ui/button";
import { Ellipsis, Search } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
    return <div className="grow shrink-0 overflow-hidden pl-5">
        <div className="w-[350px]">
            <div className="flex items-center gap-3 border border-zinc-200 px-5 py-2 rounded-full box-border mt-2 mb-5">
                <Search className="shrink-0 text-zinc-400" />
                <input className="grow border-none outline-none" placeholder="搜索" />
            </div>
            <div className="border-zinc-200 border-1 p-5 rounded-xl mb-5">
                <div className="font-bold mb-5 text-black text-xl">
                    订阅 Premium
                </div>
                <div className="text-[15px] mb-3">
                    订阅以解锁新功能，如果符合条件，还可获得收入分成。
                </div>
                <Button className="bg-sky-500 hover:bg-sky-600 rounded-full px-6 cursor-pointer">订阅</Button>
            </div>
            <div className="border-zinc-200 border-1 rounded-xl overflow-hidden mb-5">
                <div className="font-bold text-xl mb-3 px-5 pt-5">
                    有什么新鲜事
                </div>
                <div className="hover:bg-zinc-100 cursor-pointer px-5 py-2 text-[12px]">
                    <div className="flex justify-between items-center mb-0.1">
                        <div className="text-zinc-400">
                            <span className="mr-1">新加坡</span>
                            <span>的趋势</span>
                        </div>
                        <Ellipsis className="text-zinc-400" />
                    </div>
                    <div className="font-bold text-black mb-0.1">
                        Rohit
                    </div>
                    <div className="flex items-center text-zinc-400">
                        <span className="mr-1">3.54万</span>
                        <span>条帖子</span>
                    </div>
                </div>
                <div className="hover:bg-zinc-100 cursor-pointer px-5 py-2 text-[12px]">
                    <div className="flex justify-between items-center mb-0.1">
                        <div className="text-zinc-400">
                            <span className="mr-1">新加坡</span>
                            <span>的趋势</span>
                        </div>
                        <Ellipsis className="text-zinc-400" />
                    </div>
                    <div className="font-bold text-black mb-0.1">
                        #poompps
                    </div>
                    <div className="flex items-center text-zinc-400">
                        <span className="mr-1">1.11万</span>
                        <span>条帖子</span>
                    </div>
                </div>
                <div className="hover:bg-zinc-100 cursor-pointer px-5 py-2 text-[12px]">
                    <div className="flex justify-between items-center mb-0.1">
                        <div className="text-zinc-400">
                            <span className="mr-1">新加坡</span>
                            <span>的趋势</span>
                        </div>
                        <Ellipsis className="text-zinc-400" />
                    </div>
                    <div className="font-bold text-black mb-0.1">
                        #Emperor
                    </div>
                    <div className="flex items-center text-zinc-400">
                        <span className="mr-1">1.11万</span>
                        <span>条帖子</span>
                    </div>
                </div>
                <div className="text-sky-500 cursor-pointer px-5 py-3 hover:bg-zinc-100">显示更多</div>
            </div>
            <div className="border-zinc-200 border-1 rounded-xl mb-5 overflow-hidden">
                <div className="font-bold mb-5 text-black px-5 pt-5 text-xl">
                    推荐关注
                </div>
                <div className="">
                    <div className="flex items-center hover:bg-zinc-100 cursor-pointer px-5 py-2">
                        <Image
                            src="https://pbs.twimg.com/profile_images/1808921860781821952/CmtvkzWo_400x400.png"
                            alt="头像"
                            width={40}
                            height={40}
                            className="rounded-sm shrink-0 mr-2"
                        />
                        <div className="grow">
                            <div className="flex items-center gap-2">
                                <span>Aave</span>
                                <svg viewBox="0 0 22 22" aria-label="认证账号" role="img" style={{ width: 18, height: 18 }} data-testid="icon-verified"><g><linearGradient gradientUnits="userSpaceOnUse" id="150-a" x1="4.411" x2="18.083" y1="2.495" y2="21.508"><stop offset="0" stopColor="#f4e72a"></stop><stop offset=".539" stopColor="#cd8105"></stop><stop offset=".68" stopColor="#cb7b00"></stop><stop offset="1" stopColor="#f4ec26"></stop><stop offset="1" stopColor="#f4e72a"></stop></linearGradient><linearGradient gradientUnits="userSpaceOnUse" id="150-b" x1="5.355" x2="16.361" y1="3.395" y2="19.133"><stop offset="0" stopColor="#f9e87f"></stop><stop offset=".406" stopColor="#e2b719"></stop><stop offset=".989" stopColor="#e2b719"></stop></linearGradient><g clipRule="evenodd" fillRule="evenodd"><path d="M13.324 3.848L11 1.6 8.676 3.848l-3.201-.453-.559 3.184L2.06 8.095 3.48 11l-1.42 2.904 2.856 1.516.559 3.184 3.201-.452L11 20.4l2.324-2.248 3.201.452.559-3.184 2.856-1.516L18.52 11l1.42-2.905-2.856-1.516-.559-3.184zm-7.09 7.575l3.428 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z" fill="url(#150-a)"></path><path d="M13.101 4.533L11 2.5 8.899 4.533l-2.895-.41-.505 2.88-2.583 1.37L4.2 11l-1.284 2.627 2.583 1.37.505 2.88 2.895-.41L11 19.5l2.101-2.033 2.895.41.505-2.88 2.583-1.37L17.8 11l1.284-2.627-2.583-1.37-.505-2.88zm-6.868 6.89l3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z" fill="url(#150-b)"></path><path d="M6.233 11.423l3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z" fill="#d18800"></path></g></g></svg>
                            </div>
                            <div className="text-zinc-300">
                                @aave
                            </div>
                        </div>
                        <Button className="shrink-0 rounded-full cursor-pointer">关注</Button>
                    </div>
                </div>
                <div className="text-sky-500 cursor-pointer px-5 py-3 hover:bg-zinc-100">显示更多</div>
            </div>
        </div>
    </div>
}