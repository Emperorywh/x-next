import EnvironmentConfig from "@/lib/config/env";
import { VerificationCodeService } from "@/lib/redis";
import { extractZodErrors } from "@/lib/utils";
import { NextRequest } from "next/server";
import * as nodemailer from 'nodemailer';
import { z } from "zod";
import { NextResponseJson } from '@/lib/api-response';

let transporter: nodemailer.Transporter | null = null;

const SendCodeSchema = z.object({
    email: z.string().email("邮箱格式错误"),
    type: z.enum(['register', 'login', 'reset-password']).optional().default('register')
})

/**
 * 生成6位数字验证码
 * @returns 
 */
function generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


/**
 * 创建邮件发送器
 * @returns 
 */
function createTransporter() {
    const emailConfig = EnvironmentConfig.emailConfig;
    if (transporter) {
        return transporter;
    }
    transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: false,
        auth: {
            user: emailConfig.user,
            pass: emailConfig.password,
        },
    } as any)
    return transporter;
}

/**
 * 创建邮件模板
 * @param code 
 * @param type 
 * @returns 
 */
function createEmailTemplate(code: string, type: string) {
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

/**
 * 发送验证码
 * @param request 
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, type } = SendCodeSchema.parse(body);
        const cooldownStatus = await VerificationCodeService.isInCooldown(email);
        if (cooldownStatus.inCooldown) {
            return NextResponseJson({
                data: null,
                message: `请等待 ${cooldownStatus.remainingTime} 秒后再试`,
                success: false,
                status: 200
            });
        }

        // 生成验证码
        const code = generateVerificationCode();

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

        return NextResponseJson({
            data: {
                message: '验证码已发送到您的邮箱',
                expiresIn: 600
            },
            message: '验证码已发送到您的邮箱',
            success: true,
            status: 200
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponseJson({
                data: null,
                message: '请求参数错误',
                success: false,
                error: extractZodErrors(error),
                status: 400
            });
        }
        return NextResponseJson({
            data: null,
            message: '发送失败，请稍后重试',
            success: false,
            status: 500
        });
    }
}

/**
 * 验证 验证码
 * @param request 
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, code } = z.object({
            email: z.string().email('邮箱格式错误'),
            code: z.string().length(6, '验证码必须是6位')
        }).parse(body);

        const result = await VerificationCodeService.verifyCode(email, code);
        if (result.success) {
            await VerificationCodeService.delColldown(email);
            return NextResponseJson({
                data: { message: result.message },
                message: result.message,
                success: true,
                status: 200
            });
        } else {
            return NextResponseJson({
                data: null,
                message: result.message,
                success: false,
                error: result.message,
                status: 200
            });
        }
    } catch (error) {

        if (error instanceof z.ZodError) {
            return NextResponseJson({
                data: null,
                message: '请求参数错误',
                success: false,
                error: extractZodErrors(error),
                status: 400
            });
        }
        return NextResponseJson({
            data: null,
            message: '验证失败，请稍后重试',
            success: false,
            status: 500
        });
    }
}