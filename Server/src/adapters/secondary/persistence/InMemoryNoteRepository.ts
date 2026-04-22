import { NoteRepository, NoteQueryOptions } from "../../../ports/outbound/repositories/NoteRepository";
import { Note } from "../../../domain/entities/Note";

export class InMemoryNoteRepository implements NoteRepository {
    private notes: Note[] = [];

    async save(note: Note): Promise<void> {
        this.notes.push(note);
    }

    async findAll(options?: NoteQueryOptions): Promise<{ data: Note[], total: number }> {
        let filteredNotes = this.notes;
        
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
        const note = this.notes.find(note => note.id === id);
        if (!note) return null;
        return note;
    }

    async delete(id: string): Promise<void> {
        const noteIndex = this.notes.findIndex(note => note.id === id);
        if (noteIndex === -1) throw new Error("Note not found");
        this.notes.splice(noteIndex, 1);
    }

    async update(note: Note): Promise<void> {
        const noteIndex = this.notes.findIndex(n => n.id === note.id);
        if (noteIndex === -1) throw new Error("Note not found");
        this.notes[noteIndex] = note;
    }

    async getUniqueTags(): Promise<string[]> {
        const tagSet = new Set<string>();
        this.notes.forEach(note => {
            note.tag.getValue().forEach(tag => {
                tagSet.add(tag.getValue());
            });
        });
        return Array.from(tagSet);
    }
}