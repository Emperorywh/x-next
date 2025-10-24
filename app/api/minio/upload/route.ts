import { presignUpload } from "@/app/actions/minio/minio.action";
import { NextResponseJson } from "@/lib/api-response";
import { presignUploadSchema } from "@/lib/api/minio/minio.schema";
import { extractZodErrors } from "@/lib/utils";
import { NextRequest } from "next/server";
import z from "zod";

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const validateData = presignUploadSchema.parse(body);
        const response = await presignUpload(validateData);
        return NextResponseJson(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponseJson({
                data: undefined,
                message: "请求参数验证失败",
                success: false,
                status: 400,
                error: extractZodErrors(error)
            });
        }

        console.error("上传文件API发生未知错误:", error);

        return NextResponseJson({
            data: undefined,
            message: "服务器内部错误，请稍后重试",
            success: false,
            status: 500,
            error: JSON.stringify(error)
        });
    }
}