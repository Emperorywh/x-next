'use server';
import { ApiResponse, ServiceResponseJson } from "@/lib/api-response";
import { withAuth } from "@/lib/api/auth/auth";
import { getUserInfoByUsernameSchema, getUserInfoSchema, GetUserInfoSchemaDto, GetUserInfoUsernameSchemaDto, loginSchema, registerSchema, UserLoginDto, UserRegisterDto } from "@/lib/api/user/user.schema";
import { UserService } from "@/lib/api/user/user.service";
import { User } from "@/lib/api/user/user.types";
import { extractZodErrors } from "@/lib/utils";
import z from "zod";

/**
* 用户注册
* @param userRegister 
* @returns 
*/
export async function userRegister(userRegister: UserRegisterDto): Promise<ApiResponse<User>> {
    try {
        const validateData = registerSchema.parse(userRegister);
        const result = await UserService.register(validateData);
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
export async function userLogin(userLogin: UserLoginDto): Promise<ApiResponse<User>> {
    try {
        const validateData = loginSchema.parse(userLogin);

        const result = await UserService.login(validateData);

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

/**
 * 根据用户ID查询用户信息
 * @param idDto 
 * @returns 
 */
export const userGetInfoById = withAuth(async (idDto: GetUserInfoSchemaDto): Promise<ApiResponse<User>> => {
    try {
        // 验证路径参数
        const validationResult = getUserInfoSchema.parse(idDto);
        const response = await UserService.getUserInfoById(validationResult);
        return ServiceResponseJson(response);
    } catch (error) {
        return ServiceResponseJson({
            data: null,
            message: '系统错误',
            success: false,
            error: JSON.stringify(error)
        })
    }
});

/**
 * 根据username查询用户信息
 */
export const userGetInfoByUsername = withAuth(async (usernameDto: GetUserInfoUsernameSchemaDto): Promise<ApiResponse<User>> => {
    try {
        // 验证路径参数
        const validationResult = getUserInfoByUsernameSchema.parse(usernameDto);
        const response = await UserService.getUserInfoByUsername(validationResult);
        return ServiceResponseJson(response);
    } catch (error) {
        return ServiceResponseJson({
            data: null,
            message: '系统错误',
            success: false,
            error: JSON.stringify(error)
        })
    }
})