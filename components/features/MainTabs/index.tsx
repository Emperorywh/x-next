'use client';
import { useState, useRef } from "react";
import { MainTabsProps } from "./types";

export function MainTabs(props: MainTabsProps) {
    const { items = [], defaultActiveKey = '', activeKey = '', onChange } = props;

    const [tabValue, setTabValue] = useState<string>(activeKey || defaultActiveKey || items?.[0]?.key || '');
    
    // 跟踪已经挂载过的tab keys
    const mountedTabsRef = useRef<Set<string>>(new Set());

    const handleChange = (key: string) => {
        // 标记当前tab为已挂载
        mountedTabsRef.current.add(key);
        setTabValue(key);
        onChange?.(key);
    }

    // 初始化时标记默认激活的tab为已挂载
    const initialActiveKey = activeKey || defaultActiveKey || items?.[0]?.key || '';
    if (initialActiveKey && !mountedTabsRef.current.has(initialActiveKey)) {
        mountedTabsRef.current.add(initialActiveKey);
    }

    return items?.length > 0 ?
        <div className="grow overflow-hidden flex flex-col">
            {/* Tab Headers */}
            <div className="h-[50px] flex shrink-0">
                {
                    items.map(tabItem => {
                        return <div
                            key={tabItem.key}
                            className="w-1/2 flex justify-center cursor-pointer relative hover:bg-[#0f14191a]"
                            onClick={() => handleChange(tabItem.key)}
                        >
                            <span className="flex items-center text-[#536471]">
                                {tabItem.label}
                            </span>
                            {
                                tabValue === tabItem.key && <div className="absolute content-[''] bottom-0 h-1 w-15 bg-[#1D9BF0] rounded-full"></div>
                            }
                        </div>
                    })
                }
            </div>
            
            {/* Tab Content - 只渲染已挂载的children，通过CSS控制显示 */}
            <div className="grow overflow-hidden flex flex-col relative">
                {
                    items.map(tabItem => {
                        // 只渲染已经挂载过的tab
                        if (!mountedTabsRef.current.has(tabItem.key)) {
                            return null;
                        }
                        
                        return (
                            <div
                                key={tabItem.key}
                                className={`flex overflow-hidden flex-col ${tabItem.key === tabValue ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                                style={{
                                    visibility: tabItem.key === tabValue ? 'visible' : 'hidden'
                                }}
                            >
                                {tabItem.children}
                            </div>
                        );
                    })
                }
            </div>
        </div>
        : null;
}