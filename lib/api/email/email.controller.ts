import { ZodError } from "zod";
import { SendCodeVerificationCodeDto, sendVerificationCodeSchema } from "./email.schema";
import { extractZodErrors } from "@/lib/utils";
import { ApiResponse, ServiceResponseJson } from "@/lib/api-response";
import { EmailService } from "./email.service";
import { SendVerificationCodeRespnse } from "./email.types";

export class EmailController {
    /**
     * 发送验证码
     * @param sendVerificationCodeDto 
     * @returns 
     */
    static async sendVerificationCode(sendVerificationCodeDto: SendCodeVerificationCodeDto): Promise<ApiResponse<SendVerificationCodeRespnse>> {
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
}