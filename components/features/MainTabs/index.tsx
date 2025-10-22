'use client';
import { useState, useEffect } from "react";
import { MainTabsProps } from "./types";

export function MainTabs(props: MainTabsProps) {
    const { items = [], defaultActiveKey = '', activeKey = '', onChange } = props;

    const initialActiveKey = activeKey || defaultActiveKey || items?.[0]?.key || '';
    const [tabValue, setTabValue] = useState<string>(initialActiveKey);
    const [mountedTabs, setMountedTabs] = useState<Set<string>>(new Set([initialActiveKey]));

    const handleChange = (key: string) => {
        setTabValue(key);
        setMountedTabs(prev => new Set(prev).add(key));
        onChange?.(key);
    };

    useEffect(() => {
        if (activeKey && !mountedTabs.has(activeKey)) {
            setMountedTabs(prev => new Set(prev).add(activeKey));
        }
    }, [activeKey]);

    return items?.length > 0 ? (
        <div className="grow overflow-hidden flex flex-col">
            <div className="h-[50px] flex shrink-0">
                {items.map(tabItem => (
                    <div
                        key={tabItem.key}
                        className="w-1/2 flex justify-center cursor-pointer relative hover:bg-[#0f14191a]"
                        onClick={() => handleChange(tabItem.key)}
                    >
                        <span className={`flex items-center ${tabValue === tabItem.key ? 'text-[#1D9BF0]' : 'text-[#536471]'}`}>
                            {tabItem.label}
                        </span>
                        {tabValue === tabItem.key && (
                            <div className="absolute bottom-0 h-1 w-15 bg-[#1D9BF0] rounded-full"></div>
                        )}
                    </div>
                ))}
            </div>

            <div className="grow overflow-hidden flex flex-col relative">
                {items.map(tabItem => {
                    if (!mountedTabs.has(tabItem.key)) return null;
                    const isActive = tabItem.key === tabValue;
                    return (
                        <div
                            key={tabItem.key}
                            className={`grow overflow-hidden flex flex-col transition-opacity duration-200 ${
                                isActive ? 'opacity-100 z-10 visible' : 'opacity-0 z-0 invisible pointer-events-none'
                            }`}
                        >
                            {tabItem.children}
                        </div>
                    );
                })}
            </div>
        </div>
    ) : null;
}
