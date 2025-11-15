import { ServiceResponseJson } from "@/lib/api-response";
import { PresignDownloadDto, PresignUploadDto } from "./minio.schema";
import { minioClient } from "./minioClient";
import EnvironmentConfig from "@/lib/config/env";

const minIOConfig = EnvironmentConfig.minIOConfig;

export class MinIOService {

    /**
     * 生成上传文件URL
     * @param presignUploadDto 
     * @returns 
     */
    static async presignUpload(presignUploadDto: PresignUploadDto) {
        const { objectName, expires } = presignUploadDto;
        if (!objectName) {
            return ServiceResponseJson({ data: null, message: 'objectName 必须传入', success: false })
        }
        const presignedUrl = await minioClient.presignedPutObject(minIOConfig.bucket as string, objectName, Number(expires))
        return ServiceResponseJson({ data: { presignedUrl }, message: '上传URL生成成功', success: true })
    }

    /**
     * 下载文件URL
     * @param presignDownloadDto 
     */
    static async presignDownload(presignDownloadDto: PresignDownloadDto) {
        const { objectName, expires } = presignDownloadDto;
        if (!objectName) {
            return ServiceResponseJson({ data: null, message: 'objectName 必须传入', success: false })
        }
        const presignedUrl = await minioClient.presignedGetObject(minIOConfig.bucket as string, objectName, Number(expires));
        return ServiceResponseJson({ data: { presignedUrl }, message: '下载URL生成成功', success: true })
    }
}