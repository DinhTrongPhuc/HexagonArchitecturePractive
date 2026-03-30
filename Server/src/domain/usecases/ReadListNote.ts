import { NoteRepository } from "../../ports/outbound/repositories/NoteRepository";
import { ListNoteUseCase } from "../../ports/inbound/usecases/ListNoteUseCase";

export class ReadListNote implements ListNoteUseCase {
    constructor(private readonly noteReppository: NoteRepository) { }

    async execute() {
        return await this.noteReppository.findAll();
    }
}