import axios from "axios";
import { AIAgentPort } from "../../../ports/outbound/ai/AIAgentPort";

export class GroqAdapter implements AIAgentPort {
    private readonly apiKey: string;
    private readonly apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    private readonly model = "llama-3.1-8b-instant";

    constructor(apiKey: string) {
        this.apiKey = apiKey?.trim();
    }

    async generateResponse(prompt: string, context: string): Promise<string> {
        const fullSystemPrompt = `
        Bạn là một trợ lý ảo hỗ trợ kỹ thuật chuyên nghiệp. 
        Dưới đây là tri thức từ cơ sở dữ liệu của người dùng. 
        Hãy trả lời bằng tiếng Việt, súc tích, chuyên nghiệp và CHỈ dựa trên thông tin được cung cấp nếu có thể.

        --- TRI THỨC HỆ THỐNG ---
        ${context}
        ---------------------------
        `;

        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: this.model,
                    messages: [
                        { role: "system", content: fullSystemPrompt },
                        { role: "user", content: prompt }
                    ],
                    temperature: 0.5,
                    max_tokens: 1024
                },
                {
                    headers: {
                        "Authorization": `Bearer ${this.apiKey}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error: any) {
            console.error("Groq API Error:", error.response?.data || error.message);
            if (error.response?.status === 401) return "Lỗi: API Key của Groq không hợp lệ.";
            if (error.response?.status === 429) return "Lỗi: Bạn đã hết hạn mức yêu cầu trên Groq.";
            return `Lỗi kết nối Groq: ${error.message}`;
        }
    }
}
