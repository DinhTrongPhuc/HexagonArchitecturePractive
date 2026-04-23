import axios from "axios";
import { AIAgentPort } from "../../../ports/outbound/ai/AIAgentPort";

export class GroqAdapter implements AIAgentPort {
    private readonly apiKey: string;
    private readonly apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    private readonly model = "qwen/qwen3-32b";

    /*
    hoặc
    llama-3.1-8b-instant
    llama-3.3-70b-versatile
    openai/gpt-oss-safeguard-20b
    canopylabs/orpheus-v1-english
    groq/compound
    groq/compound-mini
    canopylabs/orpheus-arabic-saudi
    allam-2-7b
    meta-llama/llama-prompt-guard-2-22m
    whisper-large-v3-turbo
    meta-llama/llama-prompt-guard-2-86m
    meta-llama/llama-4-scout-17b-16e-instruct
    openai/gpt-oss-20b
    whisper-large-v3
    openai/gpt-oss-120b
    */

    constructor(apiKey: string) {
        this.apiKey = apiKey?.trim();
    }

    async generateResponse(prompt: string, context: string): Promise<string> {
        const fullSystemPrompt = `
        Bạn là một chuyên gia hỗ trợ kỹ thuật (IT Helpdesk) thông minh và tận tâm cho ứng dụng NotesPro.
        
        NHIỆM VỤ: Giải quyết vấn đề của người dùng một cách chuyên nghiệp nhất.

        --- NGUYÊN TẮC TƯ DUY & TRẢ LỜI ---
        1. ƯU TIÊN TRI THỨC HỆ THỐNG: Nếu trong phần "TRI THỨC HỆ THỐNG" có thông tin liên quan, hãy trích dẫn và hướng dẫn chi tiết từng bước dựa trên đó.
        2. PHÁN ĐOÁN THÔNG MINH: Nếu không tìm thấy thông tin chính xác trong ghi chú, ĐỪNG chỉ nói "Tôi không biết". Hãy dựa vào kinh nghiệm IT tổng quát của bạn để đưa ra các phán đoán logic và hướng dẫn người dùng các bước tự kiểm tra sơ bộ (Checklist).
        3. HỖ TRỢ TẬN TÂM: Kể cả khi câu hỏi của người dùng mơ hồ hoặc đơn giản, hãy kiên nhẫn giải thích và gợi mở vấn đề.
        4. CẤU TRÚC PHẢN HỒI: 
           - Phần 1: Câu trả lời trực tiếp hoặc Phân tích vấn đề.
           - Phần 2: Hướng dẫn chi tiết hoặc Các bước kiểm tra (nếu có).
           - Phần 3: Gợi ý bổ sung (Nếu cần thêm thông tin gì từ phía người dùng).
        5. NGÔN NGỮ: Tiếng Việt, súc tích, chuyên nghiệp nhưng vẫn gần gũi.

        --- TRI THỨC HỆ THỐNG (Dữ liệu nội bộ) ---
        ${context || "Hiện chưa có ghi chú trực tiếp cho vấn đề này."}
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
                    temperature: 0.6, // Tăng nhẹ temperature để AI linh hoạt và biết suy luận hơn
                    max_tokens: 1500
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
