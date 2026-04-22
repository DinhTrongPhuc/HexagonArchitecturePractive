import { Request, Response } from "express";
import { AskAIUseCase } from "../../../../application/usecases/ai/AskAIUseCase";

export class AIController {
    constructor(private askAIUseCase: AskAIUseCase) {}

    async ask(req: Request, res: Response) {
        try {
            const { prompt } = req.body;

            if (!prompt) {
                return res.status(400).json({ error: "Câu hỏi không được để trống" });
            }

            const response = await this.askAIUseCase.execute(prompt);
            res.status(200).json({ answer: response });
        } catch (error: any) {
            console.error("AI Controller Error:", error);
            res.status(500).json({ error: "Lỗi hệ thống khi xử lý câu hỏi AI" });
        }
    }
}
