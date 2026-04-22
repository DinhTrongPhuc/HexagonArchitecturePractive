import { NoteRepository } from "../../ports/outbound/repositories/NoteRepository";
import { ReadNoteUseCase } from "../../ports/inbound/usecases/ReadNoteUseCase";

export class ReadNote implements ReadNoteUseCase {
    constructor(private readonly noteRepository: NoteRepository) {}

    async execute(id: string): Promise<any> {
        const note = await this.noteRepository.findByID(id);
        if (!note) {
            throw new Error(`Note not found with id: ${id}`);
        }
        
        return {
            id: note.id,
            title: note.title.getValue(),
            content: note.content.getValue(),
            tags: note.tag.getValue().map((t) => t.getValue()),
            reporter: note.reporter.getValue(),
            createdAt: note.createdAt,
            updateAt: note.updateAt,
        };
    }
}
