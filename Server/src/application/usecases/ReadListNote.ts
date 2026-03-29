import { NoteRepository } from "../../ports/outbound/NoteRepository";

export class ReadListNote {
    constructor(private readonly noteReppository: NoteRepository) { }

    async execute() {
        return await this.noteReppository.findAll();
    }
}