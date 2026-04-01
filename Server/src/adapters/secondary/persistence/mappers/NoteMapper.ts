import { Note } from "../../../../domain/entities/Note";
import { Title } from "../../../../domain/value-object/Title";
import { Content } from "../../../../domain/value-object/Content";
import { TagList } from "../../../../domain/value-object/NoteTag/TagList";
import { Email } from "../../../../domain/value-object/Email";

export class NoteMapper {
    static toPersistence(note: Note) {
        return {
            _id: note.id,
            title: note.title.getValue(),
            content: note.content.getValue(),
            tags: note.tag.getValue().map(t => t.getValue()),
            reporter: note.reporter.getValue(),
            createdAt: note.createdAt,
            updateAt: note.updateAt
        };
    }

    static toDomain(raw: any): Note {
        return new Note(
            raw._id,
            new Title(raw.title),
            new Content(raw.content),
            TagList.fromString(raw.tags.join(',')),
            new Email(raw.reporter),
            new Date(raw.createdAt),
            new Date(raw.updateAt)
        );
    }
}
