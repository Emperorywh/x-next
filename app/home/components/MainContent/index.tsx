import { ComposePost } from "@/components/features/ComposePost";
import { FocusOn } from "@/components/features/FocusOn";
import { MainTabs } from "@/components/features/MainTabs";
import { PostList } from "@/components/features/PostList";

export default function MainContent() {
    return <MainTabs
        items={[
            {
                key: 'recommend',
                label: '为你推荐',
                children: <div className="grow overflow-hidden flex flex-col">
                    <div className="shrink-0 px-2 py-2 border-[#EFF3F4] border-solid border">
                        <ComposePost />
                    </div>
                    <div className="grow flex flex-col overflow-hidden">
                        <PostList />
                    </div>
                </div>
            },
            {
                key: 'focus',
                label: '关注',
                children: <FocusOn />
            }
        ]}
    />
}