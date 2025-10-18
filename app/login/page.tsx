import styles from "./index.module.css";
import { LoginForm } from "./components/LoginForm";
import { IconX } from "@/components/features/Icon";

/**
 * 登录页面
 * @returns 
 */
export default function Page() {
    return <div className={`${styles['login-container']}`}>
        <div className="flex w-screen h-screen">
            <div className="flex-1 flex justify-center items-center">
                <IconX style={{width: 380, height: 380}}/>
            </div>
            <div className="flex-1 flex justify-center items-center">
                <LoginForm />
            </div>
        </div>
    </div>
}