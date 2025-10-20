import { extractZodErrors } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ApiResponse, NextResponseJson } from '@/lib/api-response';
import { EmailController } from "@/lib/api/email/email.controller";
import { sendVerificationCodeSchema } from "@/lib/api/email/email.schema";
import { SendVerificationCodeRespnse } from "@/lib/api/email/email.types";

/**
 * 发送验证码
 * @param request 
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<SendVerificationCodeRespnse>>> {
    try {
        const body = await request.json();
        const validateData = sendVerificationCodeSchema.parse(body);
        const rsponse = await EmailController.sendVerificationCode(validateData);
        return NextResponseJson(rsponse);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponseJson({
                data: null,
                message: '请求参数错误',
                success: false,
                error: extractZodErrors(error),
                status: 400
            });
        }
        return NextResponseJson({
            data: null,
            message: '发送失败，请稍后重试',
            success: false,
            status: 500
        });
    }
}
