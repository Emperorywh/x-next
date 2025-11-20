
import { NextResponseJson } from "@/lib/api-response";
import { aiChatSchema } from "@/lib/api/ai/ai.schema";
import EnvironmentConfig from "@/lib/config/env";
import { extractZodErrors } from "@/lib/utils";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import z from "zod";

const apiKey = EnvironmentConfig.aiConfig.openAi.apiKey as string;

const client = new OpenAI({
    apiKey: apiKey
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validateData = aiChatSchema.parse(body);
        const response = await client.chat.completions.create({
            model: 'gpt-4',
            stream: true,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: validateData.message
                        }
                    ]
                }
            ]
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        const text = chunk.choices?.[0]?.delta?.content || "";
                        controller.enqueue(encoder.encode(text));
                    }
                } catch (error) {
                    controller.error(error);
                } finally {
                    controller.close()
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8"
            }
        })
    } catch (error) {
        console.log("error", error);
        if (error instanceof z.ZodError) {
            return NextResponseJson({
                data: undefined,
                message: "参数错误",
                success: false,
                error: extractZodErrors(error),
            });
        }
    }
}