import { NoteRepository } from "../../ports/outbound/NoteRepository";
import { UpdateNoteUseCase, UpdateNoteRequest } from "../../ports/inbound/UpdateNoteUseCase";
import { Note } from "../../domain/entities/Note";
import { Title } from "../../domain/value-object/Title";
import { Content } from "../../domain/value-object/Content";
import { TagList } from "../../domain/value-object/NoteTag/TagList";
import { Email } from "../../domain/value-object/Email";

export class UpdateNote implements UpdateNoteUseCase {
    constructor(private readonly noteRepository: NoteRepository) { }

    async execute(request: UpdateNoteRequest): Promise<Note> {
        const note = await this.noteRepository.findByID(request.id);
        if (!note) throw new Error("Note not found");

        if (request.title) note.updateTitle(new Title(request.title));
        if (request.content) note.updateContent(new Content(request.content));
        if (request.tags) note.updateTags(TagList.fromString(request.tags));
        if (request.reporter) note.updateReporter(new Email(request.reporter));

        await this.noteRepository.update(note);
        return note;
    }
}
