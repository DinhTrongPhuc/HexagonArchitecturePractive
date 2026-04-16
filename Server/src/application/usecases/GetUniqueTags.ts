import { GetUniqueTagsUseCase } from "../../ports/inbound/usecases/GetUniqueTagsUseCase";
import { NoteRepository } from "../../ports/outbound/repositories/NoteRepository";

export class GetUniqueTags implements GetUniqueTagsUseCase {
    constructor(private readonly noteRepository: NoteRepository) {}

    async execute(): Promise<string[]> {
        return this.noteRepository.getUniqueTags();
    }
}
