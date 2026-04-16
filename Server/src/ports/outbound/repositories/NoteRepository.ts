import { Note } from "../../../domain/entities/Note";

export interface NoteQueryOptions {
    limit?: number;
    skip?: number;
    tag?: string;
}

export interface NoteRepository {
    save(note: Note): Promise<void>;
    findAll(options?: NoteQueryOptions): Promise<{ data: Note[], total: number }>;
    findByID(id: string): Promise<Note | null>;
    delete(id: string): Promise<void>;
    update(note: Note): Promise<void>;
    getUniqueTags(): Promise<string[]>;
}