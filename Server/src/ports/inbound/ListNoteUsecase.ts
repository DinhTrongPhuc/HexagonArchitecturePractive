import { Note } from "../../domain/entities/Note";

export interface ListNoteUsecase {
    execute(): Promise<Note[]>;
}