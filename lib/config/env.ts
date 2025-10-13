interface EnvironmentVariables {
    /**
     * 数据库配置
     */
    DATABASE_URL: string;

    /**
     * Redis 配置
     */
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASSWORD?: string;
    REDIS_DB?: string;

    /**
     * 邮件配置
     */
    EMAIL_USER: string;
    EMAIL_APP_PASSWORD: string;
    EMAIL_SMTP_HOST: string;
    EMAIL_SMTP_PORT: string;
}


class EnvironmentConfig {

    /**
     * 验证环境变量是否存在
     * @param key 
     * @param defaultValue 
     * @returns 
     */
    private static validateEnvVar<T>(
        key: keyof EnvironmentVariables,
        defaultValue?: T
    ): T {
        const value = process.env?.[key] as T;
        if (value === undefined && defaultValue === undefined) {
            throw new Error(`环境变量 ${key} 未设置`);
        }
        return value;
    }

    /**
     * 获取数据库连接
     */
    static get datavaseUrl(): string {
        return this.validateEnvVar('DATABASE_URL');
    }

    /**
     * 获取Redis配置
     */
    static get redisConfig() {
        return {
            host: this.validateEnvVar('REDIS_HOST', 'localhost'),
            port: parseInt(this.validateEnvVar('REDIS_PORT', '6379')),
            password: this.validateEnvVar('REDIS_PASSWORD') as string | undefined,
            db: parseInt(this.validateEnvVar('REDIS_DB', '0'))
        }
    }

    /**
     * 获取邮件相关配置
     */
    static get emailConfig() {
        return {
            user: this.validateEnvVar('EMAIL_USER'),
            password: this.validateEnvVar('EMAIL_APP_PASSWORD'),
            host: this.validateEnvVar('EMAIL_SMTP_HOST'),
            port: this.validateEnvVar('EMAIL_SMTP_PORT'),
        }
    }
}

export default EnvironmentConfig;