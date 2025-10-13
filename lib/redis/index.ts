// Redis 模块的统一导出
export { createRedisClient, getRedisClient, closeRedisClient, RedisService, redisService } from './client';
export { VerificationCodeService } from './verification-code';
export type {
	VerificationCodeData,
	VerificationResult,
	CooldownStatus,
	RedisConfig
} from './types';
export { REDIS_KEYS, REDIS_TTL } from './types';
