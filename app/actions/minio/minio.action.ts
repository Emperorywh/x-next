import { ServiceResponseJson } from "@/lib/api-response";
import { PresignDownloadDto, presignDownloadSchema, PresignUploadDto, presignUploadSchema } from "@/lib/api/minio/minio.schema";
import { MinIOService } from "@/lib/api/minio/minio.service";
import { extractZodErrors } from "@/lib/utils";
import z from "zod";

/**
 * 上传
 * @param presignUploadDto 
 */
export const presignUpload = async (presignUploadDto: PresignUploadDto) => {
    try {
        const validateData = presignUploadSchema.parse(presignUploadDto)
        const response = await MinIOService.presignUpload(validateData);
        return ServiceResponseJson(response);
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
        console.error("presignUpload发生未知错误:", error);
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
 * 下载
 * @param presignDownloadDto 
 * @returns 
 */
export const presignDownload = async (presignDownloadDto: PresignDownloadDto) => {
    try {
        const validateData = presignDownloadSchema.parse(presignDownloadDto)
        const response = await MinIOService.presignDownload(validateData);
        return ServiceResponseJson(response);
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
        console.error("presignUpload发生未知错误:", error);
        return ServiceResponseJson({
            data: undefined,
            message: "系统错误，请稍后重试",
            success: false,
            error: JSON.stringify(error),
            status: 500
        });
    }
}