import { NoteRepository } from "../../ports/outbound/repositories/NoteRepository";
import { ListNoteUseCase } from "../../ports/inbound/usecases/ListNoteUseCase";

export class ReadListNote implements ListNoteUseCase {
    constructor(private readonly noteReppository: NoteRepository) { }

    async execute(options?: { limit?: number; skip?: number; tag?: string }) {
        const result = await this.noteReppository.findAll(options);
        
        const response: any = {
            data: result.data.map(note => ({
                id: note.id,
                title: note.title.getValue(),
                content: note.content.getValue(),
                tags: note.tag.getValue().map((t) => t.getValue()),
                reporter: note.reporter.getValue(),
                createdAt: note.createdAt,
                updateAt: note.updateAt,
           })),
           total: result.total
        };

        if (options?.skip !== undefined) response.skip = options.skip;
        if (options?.limit !== undefined) response.limit = options.limit;

        return response;
    }
}