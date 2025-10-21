import { ComposePost } from "@/components/features/ComposePost";
import { MainTabs } from "@/components/features/MainTabs";
import { PostList } from "@/components/features/PostList";

export default function MainContent() {
    return <div className="w-[750px] h-full flex flex-col box-border flex-shrink-0 border-[#EFF3F4] border-solid border">
        <MainTabs />
        <div className="shrink-0 px-2 py-2 border-[#EFF3F4] border-solid border">
            <ComposePost />
        </div>
        <div className="grow overflow-hidden">
            <PostList />
        </div>
    </div>
}