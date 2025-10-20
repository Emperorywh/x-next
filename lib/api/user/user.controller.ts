import { ApiResponse, ServiceResponseJson } from "@/lib/api-response";
import { loginSchema, registerSchema, UserLoginDto, UserRegisterDto } from "./user.schema";
import { userService } from "./user.service";
import { User } from "./user.types";
import z from "zod";
import { extractZodErrors } from "@/lib/utils";

export class UserController {
    /**
     * 用户注册
     * @param userRegister 
     * @returns 
     */
    static async register(userRegister: UserRegisterDto): Promise<ApiResponse<User>> {
        try {
            const validateData = registerSchema.parse(userRegister);
            const result = await userService.register(validateData);
            return ServiceResponseJson<User>({
                data: result?.data,
                message: result?.message || "注册成功",
                success: result.success
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return ServiceResponseJson({
                    data: undefined,
                    message: "请求参数验证失败",
                    success: false,
                    status: 400,
                    error: extractZodErrors(error)
                });
            }
            console.error("register API 发生未知错误:", error);
            return ServiceResponseJson({
                data: undefined,
                message: "系统错误，请稍后重试",
                success: false,
                error: JSON.stringify(error),
                status: 500
            });
        }
    }

    /**
     * 用户登录
     * @param userLogin 
     */
    static async login(userLogin: UserLoginDto): Promise<ApiResponse<User>> {
        try {
            const validateData = loginSchema.parse(userLogin);

            const result = await userService.login(validateData);

            return ServiceResponseJson<User>({
                data: result?.data,
                message: result?.message || "登录成功",
                success: result.success
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return ServiceResponseJson({
                    data: undefined,
                    message: "请求参数验证失败",
                    success: false,
                    status: 400,
                    error: extractZodErrors(error)
                });
            }
            console.error("login API发生未知错误:", error);
            return ServiceResponseJson({
                data: undefined,
                message: "系统错误，请稍后重试",
                success: false,
                error: JSON.stringify(error),
                status: 500
            });
        }
    }
}