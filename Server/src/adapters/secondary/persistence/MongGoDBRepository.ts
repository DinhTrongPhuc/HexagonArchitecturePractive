import { Collection, MongoClient } from "mongodb";

import { NoteMapper } from "./mappers/NoteMapper";
import { NoteRepository } from "../../../ports/outbound/repositories/NoteRepository";
import { Note } from "../../../domain/entities/Note";

export class MongoDBNoteRepository implements NoteRepository {
    private collection: Collection;

    constructor(client: MongoClient) {
        this.collection = client.db("note_app").collection("notes");
    }

    async save(note: Note): Promise<void> {
        const document = NoteMapper.toPersistence(note);
        await this.collection.insertOne(document as any);
    }

    async findAll(): Promise<Note[]> {
        const documents = await this.collection.find().toArray();
        return documents.map(doc => NoteMapper.toDomain(doc));
    }

    async findByID(id: string): Promise<Note | null> {
        const doc = await this.collection.findOne({ _id: id as any });
        if (!doc) return null;

        return NoteMapper.toDomain(doc);
    }

    async update(note: Note): Promise<void> {
        const doc = NoteMapper.toPersistence(note);
        const result = await this.collection.updateOne(
            { _id: note.id as any },
            { $set: doc }
        );

        if (result.matchedCount === 0) {
            throw new Error(`No note found with ID ${note.id} to update`);
        }
    }

    async delete(id: string): Promise<void> {
        const result = await this.collection.deleteOne({ _id: id as any });

        if (result.deletedCount === 0) {
            throw new Error(`No note found with ID ${id} to delete`);
        }
    }

}
