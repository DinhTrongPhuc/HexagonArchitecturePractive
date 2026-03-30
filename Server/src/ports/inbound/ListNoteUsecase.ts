import { Note } from "../../domain/entities/Note";

export interface ListNoteUseCase {
    execute(): Promise<Note[]>;
}