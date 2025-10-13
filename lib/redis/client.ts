import { createClient, RedisClientType } from 'redis';
import EnvironmentConfig from '@/lib/config/env';

/**
 * Redis 客户端实例
 */
let redisClient: RedisClientType | null = null;

export function createRedisClient(): RedisClientType {
	if (redisClient) {
		return redisClient;
	}

	const config = EnvironmentConfig.redisConfig;

	redisClient = createClient({
		socket: {
			host: config.host,
			port: config.port,
			keepAlive: true,        // 保持连接
			connectTimeout: 10000,  // 连接超时
		},
		password: config.password,
		database: config.db,
	});

	// 错误处理
	redisClient.on('error', (error: Error) => {
		console.error('Redis Client Error:', error);
	});

	redisClient.on('connect', () => {
		console.log('Redis Client Connected');
	});

	redisClient.on('ready', () => {
		console.log('Redis Client Ready');
	});

	redisClient.on('end', () => {
		console.log('Redis Client Disconnected');
	});

	return redisClient;
}

/**
 * 获取Redis示例
 * @returns 
 */
export function getRedisClient(): RedisClientType {
	if (!redisClient) {
		return createRedisClient();
	}
	return redisClient;
}

/**
 * 关闭Redis连接
 */
export async function closeRedisClient(): Promise<void> {
	if (redisClient) {
		await redisClient.quit();
		redisClient = null;
	}
}

export class RedisService {

	private client: RedisClientType;

	constructor() {
		this.client = getRedisClient();
	}

	// 确保客户端连接
	private async ensureClient(): Promise<RedisClientType> {
		if (!this.client || !this.client.isReady) {
			this.client = await getRedisClient();
			// 确保连接
			if (!this.client.isReady) {
				await this.client.connect();
			}
		}
		return this.client;
	}

	/**
	 * 设置键值对
	 * @param key 
	 * @param value 
	 * @param ttlSeconds 
	 */
	async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
		if (ttlSeconds) {
			await this.client.setEx(key, ttlSeconds, value);
		} else {
			await this.client.set(key, value);
		}
	}

	/**
	 * 获取值
	 * @param key 
	 * @returns 
	 */
	async get(key: string): Promise<string | null> {
		return await this.client.get(key);
	}


	/**
	 * 删除键
	 * @param key 
	 * @returns 
	 */
	async del(key: string): Promise<number> {
		return await this.client.del(key);
	}

	/**
	 * 检查键是否存在
	 * @param key 
	 * @returns 
	 */
	async exists(key: string): Promise<boolean> {
		const client = await this.ensureClient();

		// 检查连接状态
		if (!client.isReady) {
			throw new Error('Redis客户端未连接');
		}

		const result = await client.exists(key);
		return result === 1;
	}

	/**
	 * 设置过期时间
	 * @param key 
	 * @param seconds 
	 * @returns 
	 */
	async expire(key: string, seconds: number): Promise<boolean> {
		const result = await this.client.expire(key, seconds);
		return result === 1;
	}

	/**
	 * 获取剩余时间
	 * @param key 
	 * @returns 
	 */
	async ttl(key: string): Promise<number> {
		return await this.client.ttl(key);
	}

}

// 导出单例实例
export const redisService = new RedisService();