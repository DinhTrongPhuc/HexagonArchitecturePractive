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
    async findByID(id: string): Promise<Note> {
        const note = this.Note.find(note => note.id === id);
        if (!note) throw new Error("Note not found");
        return note;
    }
    async delete(id: string): Promise<void> {
        const note = this.Note.find(note => note.id === id);
        if (!note) throw new Error("Note not found");
        this.Note = this.Note.filter(note => note.id !== id);
    }
    async update(note: Note): Promise<void> {
        const noteIndex = this.Note.findIndex(note => note.id === note.id);
        if (noteIndex === -1) throw new Error("Note not found");
        this.Note[noteIndex] = note;
    }
}