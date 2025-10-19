/**
 * HTTP 客户端 - 成熟的 Axios 封装方案
 * 
 * 特性：
 * - 完善的 TypeScript 类型支持
 * - 请求/响应拦截器
 * - 统一的错误处理
 * - 请求取消支持
 * - Token 自动管理
 * - 请求/响应日志
 * - 文件上传下载支持
 */

import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
	AxiosError,
	InternalAxiosRequestConfig,
	CancelTokenSource
} from 'axios';

// ==================== 类型定义 ====================

/**
 * 扩展的请求配置
 */
export interface RequestConfig extends AxiosRequestConfig {
	/** 是否跳过错误提示 */
	skipErrorHandler?: boolean;
	/** 是否跳过 Token 注入 */
	skipToken?: boolean;
	/** 自定义元数据 */
	metadata?: Record<string, any>;
}

/**
 * 统一响应数据结构
 */
export interface ResponseData<T = any> {
	/** 响应数据 */
	data: T;
	/** 响应消息 */
	message?: string;
	/** 是否成功 */
	success?: boolean;
	/** 错误信息 */
	error?: string | Record<string, any>;
	/** 状态码 */
	code?: number;
}

/**
 * 错误响应数据
 */
export interface ErrorResponse {
	message: string;
	code?: number;
	details?: any;
}

/**
 * 拦截器配置
 */
export interface InterceptorHandlers {
	/** 请求成功拦截器 */
	requestFulfilled?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
	/** 请求失败拦截器 */
	requestRejected?: (error: any) => any;
	/** 响应成功拦截器 */
	responseFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
	/** 响应失败拦截器 */
	responseRejected?: (error: any) => any;
}

/**
 * HTTP 客户端配置
 */
export interface HttpClientConfig {
	/** API 基础路径 */
	baseURL?: string;
	/** 请求超时时间（毫秒） */
	timeout?: number;
	/** 默认请求头 */
	headers?: Record<string, string>;
	/** 是否启用请求日志 */
	enableLogging?: boolean;
	/** Token 获取函数 */
	getToken?: () => string | null | Promise<string | null>;
	/** Token 刷新函数 */
	refreshToken?: () => Promise<string>;
	/** 错误处理函数 */
	onError?: (error: AxiosError) => void;

}

// ==================== HTTP 客户端类 ====================

class HttpClient {
	private instance: AxiosInstance;
	private config: HttpClientConfig;
	private pendingRequests: Map<string, CancelTokenSource> = new Map();
	private requestInterceptors: number[] = [];
	private responseInterceptors: number[] = [];

	constructor(config: HttpClientConfig = {}) {
		this.config = {
			timeout: 30000,
			enableLogging: process.env.NODE_ENV === 'development',
			...config,
		};

		// 创建 axios 实例
		this.instance = axios.create({
			baseURL: this.config.baseURL || '',
			timeout: this.config.timeout,
			headers: {
				'Content-Type': 'application/json',
				...this.config.headers,
			},
		});

		// 初始化拦截器
		this.setupInterceptors();
	}

	/**
	 * 设置默认拦截器
	 */
	private setupInterceptors(): void {
		// 请求拦截器
		this.instance.interceptors.request.use(
			async (config: InternalAxiosRequestConfig) => {
				const customConfig = config as InternalAxiosRequestConfig & RequestConfig;

				// token - 只在客户端环境中获取
				if (typeof window !== 'undefined') {
					const token = localStorage.getItem("TOKEN");
					if (token) {
						config.headers['Authorization'] = `Bearer ${token}`;
					}
				}

				// 生成请求 ID
				const requestId = this.generateRequestId();
				config.headers['X-Request-ID'] = requestId;

				// 添加时间戳
				config.headers['X-Request-Time'] = Date.now().toString();

				// 注入 Token
				if (!customConfig.skipToken && this.config.getToken) {
					const token = await this.config.getToken();
					if (token) {
						config.headers.Authorization = `Bearer ${token}`;
					}
				}

				// 请求日志
				if (this.config.enableLogging) {
					this.logRequest(config);
				}

				return config;
			},
			(error: any) => {
				if (this.config.enableLogging) {
					console.error('❌ 请求拦截器错误:', error);
				}
				return Promise.reject(error);
			}
		);

		// 响应拦截器
		this.instance.interceptors.response.use(
			(response: AxiosResponse) => {
				// 响应日志
				if (this.config.enableLogging) {
					this.logResponse(response);
				}

				return response;
			},
			async (error: AxiosError) => {
				// 处理响应错误
				return this.handleResponseError(error);
			}
		);
	}

	/**
	 * 处理响应错误
	 */
	private async handleResponseError(error: AxiosError): Promise<any> {
		const customConfig = error.config as InternalAxiosRequestConfig & RequestConfig;

		// 取消请求的错误不处理
		if (axios.isCancel(error)) {
			if (this.config.enableLogging) {
				console.warn('⚠️ 请求已取消:', error.message);
			}
			return Promise.reject(error);
		}

		// 错误日志
		if (this.config.enableLogging) {
			this.logError(error);
		}

		// Token 过期处理 (401)
		if (error.response?.status === 401 && this.config.refreshToken) {
			try {
				const newToken = await this.config.refreshToken();
				if (newToken && error.config) {
					error.config.headers.Authorization = `Bearer ${newToken}`;
					return this.instance.request(error.config);
				}
			} catch (refreshError) {
				// Token 刷新失败，跳转登录等处理
				if (this.config.onError) {
					this.config.onError(error);
				}
			}
		}

		// 全局错误处理
		if (!customConfig?.skipErrorHandler && this.config.onError) {
			this.config.onError(error);
		}

		return Promise.reject(error);
	}

	/**
	 * 生成请求 ID
	 */
	private generateRequestId(): string {
		return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
	}

	/**
	 * 请求日志
	 */
	private logRequest(config: InternalAxiosRequestConfig): void {
		console.log(
			`🚀 [${config.method?.toUpperCase()}]`,
			config.url,
			config.params ? `\n📦 Params:` : '',
			config.params || '',
			config.data ? `\n📦 Data:` : '',
			config.data || ''
		);
	}

	/**
	 * 响应日志
	 */
	private logResponse(response: AxiosResponse): void {
		const duration = Date.now() - Number(response.config.headers['X-Request-Time'] || 0);
		console.log(
			`✅ [${response.config.method?.toUpperCase()}]`,
			response.config.url,
			`(${duration}ms)`,
			`\n📦 Response:`,
			response.data
		);
	}

	/**
	 * 错误日志
	 */
	private logError(error: AxiosError): void {
		console.error(
			`❌ [${error.config?.method?.toUpperCase()}]`,
			error.config?.url,
			`\n📦 Error:`,
			{
				status: error.response?.status,
				statusText: error.response?.statusText,
				message: error.message,
				data: error.response?.data,
			}
		);
	}

	/**
	 * 添加自定义拦截器
	 */
	addInterceptors(handlers: InterceptorHandlers): () => void {
		const reqId = handlers.requestFulfilled || handlers.requestRejected
			? this.instance.interceptors.request.use(
				handlers.requestFulfilled,
				handlers.requestRejected
			)
			: -1;

		const resId = handlers.responseFulfilled || handlers.responseRejected
			? this.instance.interceptors.response.use(
				handlers.responseFulfilled,
				handlers.responseRejected
			)
			: -1;

		if (reqId !== -1) this.requestInterceptors.push(reqId);
		if (resId !== -1) this.responseInterceptors.push(resId);

		// 返回清除函数
		return () => {
			if (reqId !== -1) {
				this.instance.interceptors.request.eject(reqId);
				const index = this.requestInterceptors.indexOf(reqId);
				if (index > -1) this.requestInterceptors.splice(index, 1);
			}
			if (resId !== -1) {
				this.instance.interceptors.response.eject(resId);
				const index = this.responseInterceptors.indexOf(resId);
				if (index > -1) this.responseInterceptors.splice(index, 1);
			}
		};
	}

	/**
	 * 取消指定请求
	 */
	cancelRequest(requestId: string): void {
		const source = this.pendingRequests.get(requestId);
		if (source) {
			source.cancel(`请求 ${requestId} 已被取消`);
			this.pendingRequests.delete(requestId);
		}
	}

	/**
	 * 取消所有pending请求
	 */
	cancelAllRequests(): void {
		this.pendingRequests.forEach((source, key) => {
			source.cancel(`批量取消请求: ${key}`);
		});
		this.pendingRequests.clear();
	}

	// ==================== HTTP 方法 ====================

	/**
	 * GET 请求
	 */
	async get<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>> {
		const response = await this.instance.get<ResponseData<T>>(url, config);
		return response.data;
	}

	/**
	 * POST 请求
	 */
	async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
		const response = await this.instance.post<ResponseData<T>>(url, data, config);
		return response.data;
	}

	/**
	 * PUT 请求
	 */
	async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
		const response = await this.instance.put<ResponseData<T>>(url, data, config);
		return response.data;
	}

	/**
	 * PATCH 请求
	 */
	async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
		const response = await this.instance.patch<ResponseData<T>>(url, data, config);
		return response.data;
	}

	/**
	 * DELETE 请求
	 */
	async delete<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>> {
		const response = await this.instance.delete<ResponseData<T>>(url, config);
		return response.data;
	}

	/**
	 * 文件上传
	 */
	async upload<T = any>(
		url: string,
		file: File | Blob,
		fieldName: string = 'file',
		config?: RequestConfig
	): Promise<ResponseData<T>> {
		const formData = new FormData();
		formData.append(fieldName, file);

		const response = await this.instance.post<ResponseData<T>>(url, formData, {
			...config,
			headers: {
				'Content-Type': 'multipart/form-data',
				...config?.headers,
			},
		});

		return response.data;
	}

	/**
	 * 文件下载
	 */
	async download(url: string, filename?: string, config?: RequestConfig): Promise<void> {
		// 只在客户端环境中执行下载
		if (typeof window === 'undefined') {
			throw new Error('文件下载功能只能在客户端环境中使用');
		}

		const response = await this.instance.get(url, {
			...config,
			responseType: 'blob',
		});

		const blob = new Blob([response.data]);
		const downloadUrl = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = downloadUrl;
		link.download = filename || this.getFilenameFromResponse(response) || 'download';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(downloadUrl);
	}

	/**
	 * 从响应头获取文件名
	 */
	private getFilenameFromResponse(response: AxiosResponse): string | null {
		const disposition = response.headers['content-disposition'];
		if (disposition) {
			const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
			if (matches?.[1]) {
				return matches[1].replace(/['"]/g, '');
			}
		}
		return null;
	}

	// ==================== 配置方法 ====================

	/**
	 * 设置默认请求头
	 */
	setHeaders(headers: Record<string, string>): void {
		Object.assign(this.instance.defaults.headers.common, headers);
	}

	/**
	 * 移除请求头
	 */
	removeHeader(key: string): void {
		delete this.instance.defaults.headers.common[key];
	}

	/**
	 * 设置超时时间
	 */
	setTimeout(timeout: number): void {
		this.instance.defaults.timeout = timeout;
	}

	/**
	 * 设置 BaseURL
	 */
	setBaseURL(baseURL: string): void {
		this.instance.defaults.baseURL = baseURL;
	}

	/**
	 * 获取原始 axios 实例（用于高级用法）
	 */
	getAxiosInstance(): AxiosInstance {
		return this.instance;
	}
}

// ==================== 导出 ====================

// 创建默认实例
export const httpClient = new HttpClient({
	baseURL: '',
	timeout: 30000,
	enableLogging: process.env.NODE_ENV === 'development',
});

// 导出类
export { HttpClient };
