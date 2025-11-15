import { minioClient } from "@/lib/api/minio/minioClient";
import EnvironmentConfig from "@/lib/config/env";
import { NextRequest, NextResponse } from "next/server";

const minIOConfig = EnvironmentConfig.minIOConfig;

// 路径参数的类型定义
interface RouteParams {
    params: {
        objectName: string[];
    };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { objectName } = await params;
        const stream = await minioClient.getObject(minIOConfig.bucket as string, `/${objectName.join("/")}`);
        return new NextResponse(stream as any, {
            headers: {
                'Content-Type': 'image/jpeg', // 根据实际类型设置
                'Cache-Control': 'public, max-age=3600, s-maxage=3600', // CDN和浏览器都缓存
                'CDN-Cache-Control': 'max-age=3600', // Vercel/Netlify等边缘缓存
            }
        })
    } catch (error) {

    }
}