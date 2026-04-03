import { Collection, MongoClient } from "mongodb";

import { NoteMapper } from "./mappers/NoteMapper";
import { NoteRepository, NoteQueryOptions } from "../../../ports/outbound/repositories/NoteRepository";
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

    async findAll(options?: NoteQueryOptions): Promise<{ data: Note[], total: number }> {
        const query: any = {};
        if (options?.tag) {
            query.tags = options.tag;
        }
        
        let cursor = this.collection.find(query);
        const total = await this.collection.countDocuments(query);
        
        if (options?.skip !== undefined) cursor = cursor.skip(options.skip);
        if (options?.limit !== undefined) cursor = cursor.limit(options.limit);
        
        const documents = await cursor.toArray();
        const data = documents.map(doc => NoteMapper.toDomain(doc));
        
        return { data, total };
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
