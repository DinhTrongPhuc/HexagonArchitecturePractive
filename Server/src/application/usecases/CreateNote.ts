import { randomUUID } from "crypto";

import { NoteRepository } from "../../ports/outbound/NoteRepository";
import { Note } from "../../domain/entities/Note";
import { Title } from "../../domain/value-object/Title";
import { Content } from "../../domain/value-object/Content";
import { TagList } from "../../domain/value-object/NoteTag/TagList";
import { Email } from "../../domain/value-object/Email";

export class CreateNote {
    constructor(private readonly noteRepository: NoteRepository) { }

    async execute(
        //id
        title: string,
        content: string,
        tags: string,
        reporter: string
        //createdAt
        //updateAt
    ) {
        const note = new Note(
            randomUUID(),
            new Title(title),
            new Content(content),
            TagList.fromString(tags),
            new Email(reporter),
            new Date(),
            new Date()
        );
        await this.noteRepository.save(note);
        return note;
    }
}