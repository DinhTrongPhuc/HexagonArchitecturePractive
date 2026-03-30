import { Note } from "../../domain/entities/Note";

export interface UpdateNoteRequest {
    id: string;
    title?: string;
    content?: string;
    tags?: string;
    reporter?: string;
}

export interface UpdateNoteUseCase {
    execute(request: UpdateNoteRequest): Promise<Note>;
}
