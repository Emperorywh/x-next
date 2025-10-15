import { Button } from "@/components/ui/button";
import { CreateAccount } from "../CreateAccount";
import { DialogLogin } from "../DialogLogin";

export function LoginForm() {
    return <div className="flex flex-col">
        <div className="text-6xl font-bold my-10">
            <span>正发生</span>
        </div>
        <div className="text-3xl font-bold my-5">
            <span>现在就加入。</span>
        </div>
        <Button variant="outline" className="my-1 rounded-full w-[300] h-[40] cursor-pointer grid grid-flow-col gap-x-3">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ width: 18, height: 18 }}><g><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path></g></svg>
            <span>使用 Google 账号注册</span>
        </Button>
        <Button variant="outline" className="my-5 rounded-full w-[300] h-[40] cursor-pointer grid grid-flow-col gap-x-3">
            <svg height="32" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="32" data-view-component="true" style={{ width: 18, height: 18 }}>
                <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
            </svg>
            <span>使用 Github 账号注册</span>
        </Button>
        <div className="flex items-center justify-center gap-2 text-gray-500 w-[300]">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-black">或</span>
            <div className="flex-1 border-t border-gray-300"></div>
        </div>
        {/* 创建账号 */}
        <CreateAccount />
        <div className="my-10 text-[11px]" style={{ color: 'rgb(83, 100, 113)' }}>
            注册即表示同意<span style={{ color: 'rgb(29, 155, 240)', cursor: 'pointer' }}>服务条款</span>及<span style={{ color: 'rgb(29, 155, 240)', cursor: 'pointer' }}>隐私政策</span>，其中包括<span style={{ color: 'rgb(29, 155, 240)', cursor: 'pointer' }}> Cookie 使用条款</span>。
        </div>
        <div>
            <div className="text-3xl font-bold my-5">
                <span>已有账号？</span>
            </div>
            <DialogLogin />
        </div>
    </div>
}