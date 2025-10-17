import MainContent from "./components/MainContent";
import NavigationBar from "./components/NavigationBar";
import Sidebar from "./components/Sidebar";

/**
 * 首页
 * @returns 
 */
export default function Page() {
    return <div className="flex w-[100vw] h-[100vh] box-border overflow-hidden p-0 m-0">
        <NavigationBar />
        <MainContent />
        <Sidebar />
    </div>
}