import { NoteRepository } from "../../ports/outbound/NoteRepository";
import { DeleteNoteUseCase } from "../../ports/inbound/DeleteNoteUseCase";

export class DeleteNote implements DeleteNoteUseCase {
    constructor(private readonly noteRepository: NoteRepository) { }

    async execute(id: string): Promise<void> {
        const note = await this.noteRepository.findByID(id);
        if (!note) throw new Error("Note not found");

        await this.noteRepository.delete(id);
    }
}
