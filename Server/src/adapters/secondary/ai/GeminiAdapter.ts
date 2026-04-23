import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIAgentPort } from "../../../ports/outbound/ai/AIAgentPort";

export class GeminiAdapter implements AIAgentPort {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(apiKey: string) {
        const cleanedKey = apiKey?.trim();
        this.genAI = new GoogleGenerativeAI(cleanedKey);
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            generationConfig: {
                maxOutputTokens: 1500,
                temperature: 0.6,
            }
        });
    }

    async generateResponse(prompt: string, context: string): Promise<string> {
        const fullPrompt = `
        Bạn là một chuyên gia hỗ trợ kỹ thuật (IT Helpdesk) thông minh cho ứng dụng NotesPro.
        NHIỆM VỤ: Giải quyết vấn đề của người dùng một cách tận tâm.

        --- QUY TẮC TƯ DUY ---
        1. ƯU TIÊN GHI CHÚ: Sử dụng tri thức trong "TRI THỨC HỆ THỐNG" làm căn cứ chính.
        2. SUY LUẬN LOGIC: Nếu không thấy ghi chú phù hợp, hãy dựa trên kiến thức IT tổng quát để đưa ra các dự đoán và hướng dẫn kiểm tra (Checklist) cho người dùng.
        3. KHÔNG BỎ CUỘC: Tuyệt đối không trả lời cụt lủn "Tôi không biết". Hãy luôn cố gắng hỗ trợ một phần nào đó (Gợi ý cách kiểm tra, liệt kê các nguyên nhân phổ biến).
        4. PHONG CÁCH: Tiếng Việt, chuyên nghiệp, súc tích và có cấu trúc rõ ràng.

        --- TRI THỨC HỆ THỐNG ---
        ${context || "Chưa có dữ liệu ghi chú cụ thể."}
        ---------------------------

        CÂU HỎI: ${prompt}
        `;

        try {
            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error("Gemini Error:", error.message);
            if (error.status === 429) return "Lỗi: Gemini hết hạn mức. Hãy thử lại sau.";
            return `Lỗi kết nối Gemini: ${error.message}`;
        }
    }
}
