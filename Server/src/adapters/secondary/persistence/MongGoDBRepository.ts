import { Note } from "../../../domain/entities/Note";
import { Title } from "../../../domain/value-object/Title";
import { Content } from "../../../domain/value-object/Content";
import { TagList } from "../../../domain/value-object/NoteTag/TagList";
import { Email } from "../../../domain/value-object/Email";
import { NoteRepository } from "../../../ports/outbound/repositories/NoteRepository";

export class MongoDBRepository implements NoteRepository {
    async save(note: Note): Promise<void> {
        throw new Error("null");
    }
    async findAll(): Promise<Note[]> {
        throw new Error("null");
    }
    async findByID(id: string): Promise<Note> {
        throw new Error("null");
    }
    async delete(id: string): Promise<void> {
        throw new Error("null");
    }
    async update(note: Note): Promise<void> {
        throw new Error("null");
    }
}