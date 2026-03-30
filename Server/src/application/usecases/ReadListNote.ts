import { NoteRepository } from "../../ports/outbound/NoteRepository";
import { ListNoteUsecase } from "../../ports/inbound/ListNoteUsecase";

export class ReadListNote implements ListNoteUsecase {
    constructor(private readonly noteReppository: NoteRepository) { }

    async execute() {
        return await this.noteReppository.findAll();
    }
}