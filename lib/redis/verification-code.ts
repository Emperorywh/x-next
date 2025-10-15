import { redisService } from "./client"

/**
 * 验证码相关Redis操作
 */
export class VerificationCodeService {

	private static readonly CODE_PREFIX = 'verification_code_';
	private static readonly CODE_TTL = 600;

	/**
	 * 存储验证码
	 * @param email 
	 * @param code 
	 * @param type 
	 */
	static async storeCode(email: string, code: string, type = 'register') {
		const key = `${this.CODE_PREFIX}${email}`;
		const data = JSON.stringify({
			code,
			type,
			createdAt: Date.now(),
			attempts: 0
		});
		await redisService.set(key, data,)
	}

	/**
	 * 获取 验证码
	 * @param email 
	 * @returns 
	 */
	static async getCode(email: string): Promise<{
		code: string,
		type: string,
		createdAt: number,
		attempts: number
	} | null> {
		const key = `${this.CODE_PREFIX}${email}`;
		const data = await redisService.get(key);
		if (!data) {
			return null;
		}
		try {
			return JSON.parse(data);
		} catch (error) {
			return null;
		}
	}

	/**
	 * 验证验证码
	 * @param email 
	 * @param inputCode 
	 * @returns 
	 */
	static async verifyCode(email: string, inputCode: string): Promise<{
		success: boolean;
		message: string;
		attempts?: number;
	}> {
		const codeData = await this.getCode(email);
		if (!codeData) {
			return {
				success: false,
				message: '验证码不存在或已过期'
			}
		}
		if (codeData.attempts >= 3) {
			this.deleteCode(email);
			return {
				success: false,
				message: '验证码尝试次数过多，请重新获取'
			};
		}
		if (codeData.code !== inputCode) {
			codeData.attempts++;
			await this.storeCode(email, codeData.code, codeData.type);
			return {
				success: false,
				message: '验证码错误',
				attempts: codeData.attempts
			}
		}
		this.deleteCode(email);
		this.delColldown(email);
		return {
			success: true,
			message: '验证成功'
		}
	}

	/**
	 * 删除验证码
	 * @param email 
	 */
	static async deleteCode(email: string): Promise<void> {
		const key = `${this.CODE_PREFIX}${email}`;
		await redisService.del(key);
	}

	/**
	 * 检查冷却期
	 * @param email 
	 * @returns 
	 */
	static async isInCooldown(email: string): Promise<{
		inCooldown: boolean;
		remainingTime?: number;
	}> {
		const cooldownKey = `cooldown:${email}`;
		const exists = await redisService.exists(cooldownKey);
		if (!exists) {
			return {
				inCooldown: false
			}
		}
		const ttl = await redisService.ttl(cooldownKey);
		return {
			inCooldown: true,
			remainingTime: ttl
		}
	}

	/**
	 * 设置冷却期
	 * @param email 
	 */
	static async setCooldown(email: string): Promise<void> {
		const cooldownKey = `cooldown:${email}`;
		await redisService.set(cooldownKey, '1', this.CODE_TTL);
	}

	/**
	 * 删除冷却期
	 * @param email 
	 * @returns 
	 */
	static async delColldown(email: string) {
		const cooldownKey = `cooldown:${email}`;
		return await redisService.del(cooldownKey);
	}

	/**
	 * 获取验证码剩余时间 
	 * @param email 
	 * @returns 
	 */
	static async getCodeTTL(email: string): Promise<number> {
		const key = `${this.CODE_PREFIX}${email}`;
		return await redisService.ttl(key);
	}
}