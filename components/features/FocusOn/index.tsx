'use client';

import { useEffect } from "react";

export function FocusOn() {
    useEffect(() => {
        console.log("关注挂载");
    }, [])
    return <div>
        关注
    </div>
}