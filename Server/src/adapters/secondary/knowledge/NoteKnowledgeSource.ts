import { KnowledgeSourcePort } from "../../../ports/outbound/knowledge/KnowledgeSourcePort";
import { NoteRepository } from "../../../ports/outbound/repositories/NoteRepository";

export class NoteKnowledgeSource implements KnowledgeSourcePort {
    constructor(private noteRepository: NoteRepository) {}

    getName(): string {
        return "Notes Database (JSON)";
    }

    async query(userInput: string): Promise<string> {
        // Logic đơn giản: Lấy tất cả note liên quan đến từ khóa trong câu hỏi
        // Trong thực tế, chúng ta có thể dùng Vector Database nhưng ở đây dùng filter là đủ
        const allNotes = await this.noteRepository.findAll({});
        
        // Tìm các note có title hoặc content chứa từ khóa từ người dùng
        const keywords = userInput.toLowerCase().split(' ').filter(w => w.length > 3);
        
        const relevantNotes = allNotes.data.filter(note => {
            const text = (note.title.getValue() + " " + note.content.getValue()).toLowerCase();
            return keywords.some(kw => text.includes(kw));
        }).slice(0, 5); // Lấy tối đa 5 note liên quan nhất để tiết kiệm token

        if (relevantNotes.length === 0) {
            return "";
        }

        return relevantNotes.map(n => `[Ghi chú: ${n.title.getValue()}]\nNội dung: ${n.content.getValue()}\nTags: ${n.tag.getValue().map(t => t.getValue()).join(', ')}`).join('\n\n');
    }
}
