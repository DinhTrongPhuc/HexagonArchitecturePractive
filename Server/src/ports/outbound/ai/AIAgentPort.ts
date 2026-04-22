export interface AIAgentPort {
    generateResponse(prompt: string, context: string): Promise<string>;
}
