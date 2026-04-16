import { NoteRepository, NoteQueryOptions } from "../../../ports/outbound/repositories/NoteRepository";
import { Note } from "../../../domain/entities/Note";

export class InMemoryNoteRepository implements NoteRepository {
    private Note: Note[] = [];

    async save(note: Note): Promise<void> {
        this.Note.push(note);
    }

    async findAll(options?: NoteQueryOptions): Promise<{ data: Note[], total: number }> {
        let filteredNotes = this.Note;
        
        if (options?.tag) {
            filteredNotes = filteredNotes.filter(note => 
                note.tag.getValue().some(t => t.getValue() === options.tag)
            );
        }
        
        const total = filteredNotes.length;
        
        if (options?.skip !== undefined) {
             filteredNotes = filteredNotes.slice(options.skip);
        }
        if (options?.limit !== undefined) {
             filteredNotes = filteredNotes.slice(0, options.limit);
        }
        
        return { data: filteredNotes, total };
    }

    async findByID(id: string): Promise<Note | null> {
        const note = this.Note.find(note => note.id === id);
        if (!note) return null;
        return note;
    }

    async delete(id: string): Promise<void> {
        const note = this.Note.find(note => note.id === id);
        if (!note) throw new Error("Note not found");
        this.Note = this.Note.filter(note => note.id !== id);
    }

    async update(note: Note): Promise<void> {
        const noteIndex = this.Note.findIndex(n => n.id === note.id);
        if (noteIndex === -1) throw new Error("Note not found");
        this.Note[noteIndex] = note;
    }

    async getUniqueTags(): Promise<string[]> {
        const tagSet = new Set<string>();
        this.Note.forEach(note => {
            note.tag.getValue().forEach(tag => {
                tagSet.add(tag.getValue());
            });
        });
        return Array.from(tagSet);
    }
}