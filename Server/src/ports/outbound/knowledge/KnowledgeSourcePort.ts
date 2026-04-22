export interface KnowledgeSourcePort {
    getName(): string;
    query(userInput: string): Promise<string>;
}
