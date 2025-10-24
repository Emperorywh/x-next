import EnvironmentConfig from '@/lib/config/env';
import { Client } from 'minio';

const minioConfig = EnvironmentConfig.minIOConfig;

export const minioClient = new Client({
    endPoint: minioConfig.endPoint as string,
    port: minioConfig.port as number,
    useSSL: minioConfig.useSSL,
    accessKey: minioConfig.accessKey as string,
    secretKey: minioConfig.secretKey as string
});