'use client';
import Link from "next/link"
import { IconPersonal } from "../Icon"
import { useEffect, useState } from "react"

/**
 * 个人资料导航组件
 * @returns 
 */
export const LinkPersonal = () => {
    const [linkHref, setLinkHref] = useState<string | null>(null);

    useEffect(() => {
        // useEffect 只在客户端运行，可以安全地访问 localStorage
        const loginUser = JSON.parse(localStorage?.getItem?.("LOGIN_USER") || "{}");
        const username = loginUser?.username;
        setLinkHref(username);
    }, []);

    if (!linkHref) return null;
    return <Link href={`/${linkHref}`}>
        <div className="w-[259px] cursor-pointer">
            <div className="h-[50px] inline-flex items-center px-5 gap-5 hover:bg-gray-200 rounded-full">
                <IconPersonal />
                <span>
                    个人资料
                </span>
            </div>
        </div>
    </Link>
}