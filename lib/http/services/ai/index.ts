import { httpClient } from "../../client";

/**
 * ai 对话
 * @param data 
 * @returns 
 */
export async function aiChat(data: { message: string }) {
    return httpClient.post('/api/ai/chat', data);
}