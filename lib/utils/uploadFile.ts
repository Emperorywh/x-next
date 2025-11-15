/**
 * 上传文件
 * @param options 
 * @returns 
 */
export function uploadFile(options: UploadOptions): Promise<any> {
    const {
        url,
        file,
        fieldFileName = 'file',
        method = 'POST',
        data,
        headers,
        onProgress,
        onSuccess,
        onError
    } = options;
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });
        }

        /**
         * 上传进度
         * @param event 
         */
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable && onProgress) {
                const percent = Math.round((event.loaded / event.total) * 100);
                onProgress({
                    percent,
                    loaded: event.loaded,
                    total: event.total
                });
            }
        }

        /**
         * 上传成功
         */
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                onSuccess?.(xhr.response);
                resolve(xhr.response);
            } else {
                const error = new Error(`上传失败：${xhr.status}`);
                onError?.(error);
                reject(error);
            }
        }

        /**
         * 上传失败
         */
        xhr.onerror = () => {
            const error = new Error("Network error during upload");
            onError?.(error);
            reject(error);
        }

        if (method === 'PUT') {
            // 如果没显式指定 Content-Type，则自动推断
            if (!headers?.['Content-Type']) {
                xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
            }
            xhr.send(file);
        } else {
            const formData = new FormData();
            /**
             * 附加文件
             */
            formData.append(fieldFileName, file);
            if (data) {
                Object.entries(data).forEach(([key, value]) => {
                    formData.append(key, value);
                });
            }
            xhr.send(formData);
        }
    });
}

/**
 * 生成ObjectName
 * @param userId 
 * @param fileExtension 
 */
export function generateMinIOObjectName(userId: string, fileExtension: string) {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${userId}/${timestamp}_${randomStr}.${fileExtension}`;
}

export interface UploadOptions {
    /**
     * 上传目标地址
     */
    url: string;

    /**
     * 上传文件的Key值
     */
    fieldFileName?: string;

    /**
     * 上传方法类型
     */
    method?: 'POST' | 'PUT';

    /**
     * 文件对象
     */
    file: File;

    /**
     * 额外表单字段
     */
    data?: Record<string, any>;

    /**
     * 自定义请求头
     */
    headers?: Record<string, string>;

    /**
     * 上传进度回调
     * @param progress 
     * @returns 
     */
    onProgress?: (progress: UploadProgress) => void;

    /**
     * 上传完成回调
     * @param response 
     * @returns 
     */
    onSuccess?: (response: any) => void;

    /**
     * 上传失败回调
     * @param error 
     * @returns 
     */
    onError?: (error: any) => void;
}

export interface UploadProgress {
    /**
     * 上传进度
     */
    percent: number;
    /**
     * 已上传字节数
     */
    loaded: number;
    /**
     * 总字节数
     */
    total: number;
}