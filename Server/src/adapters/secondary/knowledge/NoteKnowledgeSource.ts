import { KnowledgeSource } from "../../../application/ports/inbound/ai/KnowledgeSource";
import { NoteRepository } from "../../../application/ports/outbound/persistence/NoteRepository";
import Fuse from "fuse.js";

export class NoteKnowledgeSource implements KnowledgeSource {
    constructor(private noteRepository: NoteRepository) {}

    getName(): string {
        return "Vietnamese Optimized Notes Database";
    }

    // Hàm bỏ dấu tiếng Việt để tìm kiếm chính xác hơn
    private removeAccents(str: string): string {
        return str.normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }

    async query(userInput: string): Promise<string> {
        const allNotesResponse = await this.noteRepository.findAll({});
        const allNotes = allNotesResponse.data;

        if (!allNotes || allNotes.length === 0) return "";

        const searchableData = allNotes.map(n => {
            const title = n.title.getValue();
            const content = n.content.getValue();
            const tags = n.tag.getValue().map(t => t.getValue()).join(", ");
            
            return {
                title,
                content,
                tags,
                // Tạo một bản text không dấu để tìm kiếm "ngầm"
                normalizedSearch: this.removeAccents(`${title} ${content} ${tags}`).toLowerCase()
            };
        });

        const normalizedInput = this.removeAccents(userInput).toLowerCase();

        const fuse = new Fuse(searchableData, {
            keys: [
                { name: 'title', weight: 2 },
                { name: 'normalizedSearch', weight: 1.5 },
                { name: 'content', weight: 1 }
            ],
            threshold: 0.7, // Mức độ cân bằng
            ignoreLocation: true, // Tìm ở bất kỳ đâu trong văn bản
            useExtendedSearch: true // Cho phép tìm kiếm nâng cao
        });

        // Tìm kiếm bằng bản có dấu và không dấu
        let searchResults = fuse.search(userInput);
        if (searchResults.length === 0) {
            searchResults = fuse.search(normalizedInput);
        }

        console.log(`🔍 [AI Search] Input: "${userInput}" | Found: ${searchResults.length} notes.`);

        // Nếu vẫn không thấy, thử tìm kiếm chứa từ khóa thủ công (Fallback)
        if (searchResults.length === 0) {
            const keywords = normalizedInput.split(/\s+/).filter(w => w.length > 2);
            const fallbackResults = searchableData.filter(item => 
                keywords.some(kw => item.normalizedSearch.includes(kw))
            );
            
            if (fallbackResults.length > 0) {
                console.log(`🔍 [AI Search] Fallback matched ${fallbackResults.length} notes.`);
                return fallbackResults.slice(0, 15).map(n => 
                    `[Ghi chú: ${n.title}]\nNội dung: ${n.content}\nTags: ${n.tags}`
                ).join('\n\n---\n\n');
            }
        }

        if (searchResults.length === 0) return "";

        return searchResults.slice(0, 20).map(result => {
            const n = result.item;
            return `[Ghi chú: ${n.title}]\nNội dung: ${n.content}\nTags: ${n.tags}`;
        }).join('\n\n---\n\n');
    }
}
