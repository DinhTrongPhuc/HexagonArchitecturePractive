import { Note } from "../../domain/entities/Note";

export interface NoteRepository {
    save(note: Note): Promise<void>;
}