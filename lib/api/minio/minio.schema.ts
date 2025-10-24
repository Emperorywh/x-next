import z from "zod";

/**
 * 上传文件 签名Schema
 */
export const presignUploadSchema = z.object({
    objectName: z.string(),
    expires: z.number().optional()
});

/**
 * 上传签名DTO
 */
export type PresignUploadDto = z.infer<typeof presignUploadSchema>;

/**
 * 下载文件 签名Schema
 */
export const presignDownloadSchema = z.object({
    objectName: z.string(),
    expires: z.number().optional()
});

/**
 * 下载文件DTO
 */
export type PresignDownloadDto = z.infer<typeof presignDownloadSchema>;