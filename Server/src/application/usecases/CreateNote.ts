import { randomUUID } from "crypto";

import { Note } from "../../domain/entities/Note";
import { Title } from "../../domain/value-object/Title";
import { Content } from "../../domain/value-object/Content";
import { TagList } from "../../domain/value-object/NoteTag/TagList";
import { Email } from "../../domain/value-object/Email";

export class CreateNote {
    constructor(private readonly noteRepository: NoteRepository) { }

    async execute(title: string, content: string, tags: string[], reporter: string) {
        const note = new Note(
            randomUUID(),
            new Title(title),
            new Content(content),
            new TagList(tags),
            new Email(reporter),
            new Date(),
            new Date()
        );
        await this.noteRepository.save(note);
    }
}