import z from "zod";

/**
 * 聊天校验
 */
export const aiChatSchema = z.object({
    message: z.string("消息不能为空")
});

export type AiChatDto = z.infer<typeof aiChatSchema>;