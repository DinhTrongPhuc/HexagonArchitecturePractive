import { NoteRepository } from "../../ports/outbound/NoteRepository";
import { ListNoteUseCase } from "../../ports/inbound/ListNoteUseCase";

export class ReadListNote implements ListNoteUseCase {
    constructor(private readonly noteReppository: NoteRepository) { }

    async execute() {
        return await this.noteReppository.findAll();
    }
}