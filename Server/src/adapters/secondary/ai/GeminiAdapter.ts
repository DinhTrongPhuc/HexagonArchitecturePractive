import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIAgentPort } from "../../../ports/outbound/ai/AIAgentPort";

export class GeminiAdapter implements AIAgentPort {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        const cleanedKey = apiKey?.trim();
        this.genAI = new GoogleGenerativeAI(cleanedKey);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            }
        });
    }

    async generateResponse(prompt: string, context: string): Promise<string> {
        const fullPrompt = `
        Bạn là một trợ lý ảo hỗ trợ kỹ thuật chuyên nghiệp. 
        Dưới đây là tri thức từ cơ sở dữ liệu của người dùng. 
        Hãy trả lời bằng tiếng Việt, súc tích và chuyên nghiệp.

        --- TRI THỨC HỆ THỐNG ---
        ${context}
        ---------------------------

        CÂU HỎI: ${prompt}
        `;

        try {
            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error("Gemini Error:", error.message);
            if (error.status === 429) return "Lỗi: Gemini hết hạn mức (Quota). Hãy thử lại sau.";
            return `Lỗi kết nối Gemini: ${error.message}`;
        }
    }
}
