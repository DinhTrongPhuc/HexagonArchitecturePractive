import { NoteRepository } from "../../ports/outbound/NoteRepository";
import { Note } from "../../domain/entities/Note";

export class InMemoryNoteRepository implements NoteRepository {
    private Note: Note[] = [];

    async save(note: Note): Promise<void> {
        this.Note.push(note);
    }
    async findAll(): Promise<Note[]> {
        return this.Note;
    }
}