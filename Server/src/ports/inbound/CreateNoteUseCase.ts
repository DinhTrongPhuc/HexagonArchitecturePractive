import { Note } from "../../domain/entities/Note";

export interface CreateNoteRequest {
    title: string;
    content: string;
    tags: string;
    reporter: string;
}

export interface CreateNoteUseCase {
    execute(request: CreateNoteRequest): Promise<Note>;
}
