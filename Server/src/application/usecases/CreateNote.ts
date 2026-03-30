import { randomUUID } from "crypto";

import { NoteRepository } from "../../ports/outbound/repositories/NoteRepository";
import { Note } from "../../domain/entities/Note";
import { Title } from "../../domain/value-object/Title";
import { Content } from "../../domain/value-object/Content";
import { TagList } from "../../domain/value-object/NoteTag/TagList";
import { Email } from "../../domain/value-object/Email";
import { CreateNoteRequest, CreateNoteUseCase } from "../../ports/inbound/usecases/CreateNoteUseCase";

export class CreateNote implements CreateNoteUseCase {
    constructor(private readonly noteRepository: NoteRepository) { }

    async execute(request: CreateNoteRequest): Promise<Note> {
        const note = new Note(
            randomUUID(),
            new Title(request.title),
            new Content(request.content),
            TagList.fromString(request.tags),
            new Email(request.reporter),
            new Date(),
            new Date()
        );
        await this.noteRepository.save(note);
        return note;
    }
}