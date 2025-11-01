import { PresignDownloadDto, PresignUploadDto } from "@/lib/api/minio/minio.schema";
import { httpClient } from "../../client";

/**
 * 获取上传url
 * @param data 
 * @returns 
 */
export async function uploadFileUrl(data: PresignUploadDto) {
    return httpClient.put<any>('/api/minio/upload', data);
}

/**
 * 获取链接
 * @param data 
 * @returns 
 */
export async function getUploadResultUrl(data: PresignDownloadDto) {
    return httpClient.get<any>(`/api/minio/download?objectName=${data.objectName}`);
}