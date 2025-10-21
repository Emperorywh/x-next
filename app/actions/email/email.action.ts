'use server';
import { ApiResponse, ServiceResponseJson } from "@/lib/api-response";
import { SendCodeVerificationCodeDto, sendVerificationCodeSchema } from "@/lib/api/email/email.schema";
import { EmailService } from "@/lib/api/email/email.service";
import { SendVerificationCodeRespnse } from "@/lib/api/email/email.types";
import { extractZodErrors } from "@/lib/utils";
import { ZodError } from "zod";

/**
 * 发送验证码
 * @param sendVerificationCodeDto 
 * @returns 
 */
export async function emailSendVerificationCode(sendVerificationCodeDto: SendCodeVerificationCodeDto): Promise<ApiResponse<SendVerificationCodeRespnse>> {
    try {
        const validateData = sendVerificationCodeSchema.parse(sendVerificationCodeDto);
        const response = await EmailService.sendVerificationCode(validateData);
        return ServiceResponseJson(response);
    } catch (error) {
        console.error('未知错误：', error);
        if (error instanceof ZodError) {
            const errorInfo = extractZodErrors(error)
            return ServiceResponseJson({
                data: null,
                message: '数据验证失败',
                success: false,
                error: errorInfo.errors
            })
        }
        return ServiceResponseJson({
            data: null,
            message: '系统错误',
            success: false,
            error: JSON.stringify(error)
        })
    }
}