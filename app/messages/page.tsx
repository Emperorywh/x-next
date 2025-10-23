import NavigationBar from "@/components/features/NavigationBar";
import Sidebar from "@/components/features/Sidebar";

/**
 * 私信
 * @returns 
 */
export default function Page() {
    return <div className="flex w-[100vw] h-[100vh] box-border overflow-hidden p-0 m-0">
        <NavigationBar />
        <div className="w-[600px] h-[100vh] overflow-hidden flex flex-col box-border flex-shrink-0 border-[#EFF3F4] border-solid border">
            <h1>私信</h1>
        </div>
        <Sidebar />
    </div>
}