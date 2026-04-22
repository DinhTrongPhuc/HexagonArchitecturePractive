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
        Bạn là một trợ lý ảo hỗ trợ kỹ thuật cho ứng dụng NotesPro.
        NHIỆM VỤ CỦA BẠN: Trả lời câu hỏi dựa trên "TRI THỨC HỆ THỐNG" được cung cấp.

        --- QUY TẮC BẮT BUỘC ---
        1. CHỈ sử dụng thông tin trong phần "TRI THỨC HỆ THỐNG" để trả lời.
        2. Nếu phần "TRI THỨC HỆ THỐNG" trống hoặc không chứa thông tin liên quan, hãy trả lời chính xác: "Xin lỗi, tôi không tìm thấy thông tin này trong bộ ghi chú của bạn. Bạn vui lòng bổ sung ghi chú hoặc kiểm tra lại từ khóa."
        3. KHÔNG ĐƯỢC tự ý hỏi thêm người dùng về tên ứng dụng hay mô tả khác.
        4. Trả lời bằng tiếng Việt, súc tích và chuyên nghiệp.

        --- TRI THỨC HỆ THỐNG ---
        ${context || "KHÔNG CÓ DỮ LIỆU LIÊN QUAN TRONG GHI CHÚ."}
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
                    temperature: 0.2, // Giảm temperature để AI trả lời chính xác hơn, ít sáng tạo linh tinh
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
