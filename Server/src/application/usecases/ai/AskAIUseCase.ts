import { AIAgentPort } from "../../../ports/outbound/ai/AIAgentPort";
import { KnowledgeSourcePort } from "../../../ports/outbound/knowledge/KnowledgeSourcePort";

export class AskAIUseCase {
    private knowledgeSources: KnowledgeSourcePort[] = [];

    constructor(private aiAgent: AIAgentPort) {}

    addKnowledgeSource(source: KnowledgeSourcePort) {
        this.knowledgeSources.push(source);
    }

    async execute(userInput: string): Promise<string> {
        // 1. Thu thập bối cảnh từ tất cả các nguồn tri thức
        const contexts = await Promise.all(
            this.knowledgeSources.map(source => source.query(userInput))
        );

        const combinedContext = contexts.filter(c => c !== "").join("\n---\n");

        // 2. Gửi cho AI Agent để tạo câu trả lời
        return await this.aiAgent.generateResponse(userInput, combinedContext);
    }
}
