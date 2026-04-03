import { Note } from "../../../domain/entities/Note";

export interface ListNoteUseCase {
    execute(options?: { limit?: number; skip?: number; tag?: string }): Promise<{ data: any[], total: number, limit?: number, skip?: number }>;
}