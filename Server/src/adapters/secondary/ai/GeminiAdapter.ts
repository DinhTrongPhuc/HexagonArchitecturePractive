import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIAgentPort } from "../../../ports/outbound/ai/AIAgentPort";

export class GeminiAdapter implements AIAgentPort {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        const cleanedKey = apiKey?.trim();
        this.genAI = new GoogleGenerativeAI(cleanedKey);
        this.model = this.genAI.getGenerativeModel({
            model: "gemma-3-1b",
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.2, // Giảm temperature để bớt "chém gió"
            }
        });
    }

    async generateResponse(prompt: string, context: string): Promise<string> {
        const fullPrompt = `
        Bạn là một trợ lý ảo hỗ trợ kỹ thuật cho ứng dụng NotesPro.
        NHIỆM VỤ: Trả lời dựa trên "TRI THỨC HỆ THỐNG".

        --- QUY TẮC ---
        1. CHỈ dùng thông tin trong "TRI THỨC HỆ THỐNG".
        2. Nếu không thấy thông tin, hãy trả lời: "Xin lỗi, tôi không tìm thấy thông tin này trong ghi chú."
        3. KHÔNG hỏi ngược lại người dùng.

        --- TRI THỨC HỆ THỐNG ---
        ${context || "KHÔNG CÓ DỮ LIỆU."}
        ---------------------------

        CÂU HỎI: ${prompt}
        `;

        try {
            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error("Gemini Error:", error.message);
            if (error.status === 429) return "Lỗi: Gemini hết hạn mức. Thử lại sau.";
            return `Lỗi kết nối Gemini: ${error.message}`;
        }
    }
}
