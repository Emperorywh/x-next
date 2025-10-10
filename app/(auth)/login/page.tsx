import styles from "./index.module.css";
import { LogoIcon } from "@/components/templates";
import { LoginForm } from "./components/LoginForm";

/**
 * 登录页面
 * @returns 
 */
export default function Page() {
    return <div className={`${styles['login-container']}`}>
        <div className="flex w-screen h-screen">
            <div className="flex-1 flex justify-center items-center">
                <LogoIcon />
            </div>
            <div className="flex-1 flex justify-center items-center">
                <LoginForm />
            </div>
        </div>
    </div>
}