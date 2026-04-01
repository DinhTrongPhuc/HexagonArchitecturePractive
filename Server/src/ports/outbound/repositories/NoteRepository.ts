import { Note } from "../../../domain/entities/Note";

export interface NoteRepository {
    save(note: Note): Promise<void>;
    findAll(): Promise<Note[]>;
    findByID(id: string): Promise<Note | null>;
    delete(id: string): Promise<void>;
    update(note: Note): Promise<void>;
}