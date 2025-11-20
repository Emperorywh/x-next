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

    /**
     * Token相关
     */
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;

    /**
     * 项目名称
     */
    APP_NAME: string;

    /**
     * MinIO相关配置
     */
    MINIO_ENDPOINT: string;
    MINIO_PORT: string;
    MINIO_USE_SSL: boolean;
    MINIO_ACCESS_KEY: string;
    MINIO_SECRET_KEY: string;
    MINIO_BUCKET_NAME: string;

    /**
     * OpenAI API
     */
    OPENAI_API_KEY: string;
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

    /**
     * 获取token相关的配置
     */
    static get tokenConfig() {
        return {
            accessTokenSecret: this.validateEnvVar('ACCESS_TOKEN_SECRET'),
            refreshTokenSecret: this.validateEnvVar('REFRESH_TOKEN_SECRET')
        }
    }

    /**
     * 项目名称
     */
    static get appName() {
        return this.validateEnvVar('APP_NAME') || '';
    }

    /**
     * 获取MinIO相关配置
     */
    static get minIOConfig() {
        return {
            endPoint: this.validateEnvVar("MINIO_ENDPOINT"),
            port: this.validateEnvVar("MINIO_PORT"),
            useSSL: this.validateEnvVar("MINIO_USE_SSL") === 'true' || false,
            accessKey: this.validateEnvVar("MINIO_ACCESS_KEY"),
            secretKey: this.validateEnvVar("MINIO_SECRET_KEY"),
            bucket: this.validateEnvVar("MINIO_BUCKET_NAME")
        }
    }

    /**
     * ai相关配置
     */
    static get aiConfig() {
        return {
            openAi: {
                apiKey: this.validateEnvVar("OPENAI_API_KEY")
            }
        }
    }
}

export default EnvironmentConfig;