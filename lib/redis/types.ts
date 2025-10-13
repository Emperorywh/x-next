// Redis 相关的类型定义
export interface VerificationCodeData {
	code: string;
	type: string;
	createdAt: number;
	attempts: number;
}

export interface VerificationResult {
	success: boolean;
	message: string;
	attempts?: number;
}

export interface CooldownStatus {
	inCooldown: boolean;
	remainingTime?: number;
}

// Redis 配置类型
export interface RedisConfig {
	host: string;
	port: number;
	password?: string;
	db?: number;
}

// Redis 键前缀常量
export const REDIS_KEYS = {
	VERIFICATION_CODE: 'verification_code:',
	COOLDOWN: 'cooldown:',
	USER_SESSION: 'user_session:',
	CACHE: 'cache:',
} as const;

// Redis TTL 常量（秒）
export const REDIS_TTL = {
	VERIFICATION_CODE: 600, // 10分钟
	COOLDOWN: 60, // 1分钟
	USER_SESSION: 3600, // 1小时
	CACHE: 300, // 5分钟
} as const;
