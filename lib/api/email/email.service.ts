import EnvironmentConfig from "@/lib/config/env";
import * as nodemailer from 'nodemailer';
import { SendCodeVerificationCodeDto, sendVerificationCodeSchema } from "./email.schema";
import { VerificationCodeService } from "@/lib/redis";
import { ServiceResponseJson } from "@/lib/api-response";
export class EmailService {

	private static transporter: nodemailer.Transporter | null;

	/**
	 * 发送验证码
	 * @param sendVerificationCodeDto 
	 * @returns 
	 */
	static async sendVerificationCode(sendVerificationCodeDto: SendCodeVerificationCodeDto) {
		const { email, type } = sendVerificationCodeSchema.parse(sendVerificationCodeDto);
		const cooldownStatus = await VerificationCodeService.isInCooldown(email);
		if (cooldownStatus.inCooldown) {
			return ServiceResponseJson({
				data: null,
				message: `请等待 ${cooldownStatus.remainingTime} 秒后再试`,
				success: false
			});
		}

		// 生成验证码
		const code = this.generateVerificationCode();

		// 存储验证码到 Redis
		await VerificationCodeService.storeCode(email, code, type);

		// 创建邮件发送器
		// const transporter = createTransporter();

		// const emailContent = createEmailTemplate(code, type);

		// // 邮件配置
		// const emailConfig = EnvironmentConfig.emailConfig;

		// await transporter.sendMail({
		//     from: `邮件通知 <${emailConfig.user}>`,
		//     to: email,
		//     subject: emailContent.subject,
		//     html: emailContent.html,
		//     text: emailContent.text
		// });

		await VerificationCodeService.setCooldown(email);

		return ServiceResponseJson({
			data: {
				message: '验证码已发送到您的邮箱',
				expiresIn: 600
			},
			message: '验证码已发送到您的邮箱',
			success: true
		});
	}

	/**
	 * 生成6位数字验证码
	 * @returns 
	 */
	private static generateVerificationCode(): string {
		return Math.floor(100000 + Math.random() * 900000).toString();
	}

	/**
	 * 创建邮件发送器
	 * @returns 
	 */
	private static createTransporter() {
		const emailConfig = EnvironmentConfig.emailConfig;
		if (this.transporter) {
			return this.transporter;
		}
		this.transporter = nodemailer.createTransport({
			host: emailConfig.host,
			port: emailConfig.port,
			secure: false,
			auth: {
				user: emailConfig.user,
				pass: emailConfig.password,
			},
		} as any)
		return this.transporter;
	}

	/**
	 * 创建邮件模板
	 * @param code 
	 * @param type 
	 * @returns 
	 */
	private static createEmailTemplate(code: string, type: string) {
		const typeText = {
			register: '注册',
			login: '登录',
			'reset-password': '重置密码'
		}[type] || '注册';

		return {
			subject: `【验证码】${typeText}验证码 - ${code}`,
			html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">验证码</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #333; margin-top: 0;">您的${typeText}验证码</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            您好！您正在进行${typeText}操作，请使用以下验证码完成验证：
          </p>
          
          <div style="background: white; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${code}</span>
          </div>
          
          <p style="color: #999; font-size: 14px;">
            <strong>重要提示：</strong><br>
            • 验证码有效期为 10 分钟<br>
            • 请勿将验证码泄露给他人<br>
            • 如非本人操作，请忽略此邮件
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
          <p>此邮件由系统自动发送，请勿回复</p>
        </div>
      </div>
    `,
			text: `
      您的${typeText}验证码是：${code}
      
      验证码有效期为 10 分钟，请及时使用。
      
      如非本人操作，请忽略此邮件。
    `
		};
	}
}