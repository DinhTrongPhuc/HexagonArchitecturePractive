import * as fs from 'fs/promises';
import * as path from 'path';

import { NoteRepository, NoteQueryOptions } from "../../../ports/outbound/repositories/NoteRepository";
import { Note } from "../../../domain/entities/Note";
import { Title } from "../../../domain/value-object/Title";
import { Content } from "../../../domain/value-object/Content";
import { TagList } from "../../../domain/value-object/NoteTag/TagList";
import { Email } from "../../../domain/value-object/Email";

export class JsonNoteRepository implements NoteRepository {
    private filePath = path.join(process.cwd(), 'data.json');

    private async readFromFile(): Promise<any[]> {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error: any) {
            return [];
        }
    }

    private async writeToFile(notes: any[]): Promise<void> {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(notes, null, 2));
        } catch (error: any) {
            throw new Error("Error writing to file" + error.message);
        }
    }

    async save(note: Note): Promise<void> {
        const notes = await this.readFromFile();

        const noteData = {
            id: note.id,
            title: note.title.getValue(),
            content: note.content.getValue(),
            tags: note.tag.getValue().map(t => t.getValue()).join(','),
            reporter: note.reporter.getValue(),
            createdAt: note.createdAt,
            updateAt: note.updateAt
        };

        notes.push(noteData);
        await this.writeToFile(notes);
    }

    async findAll(options?: NoteQueryOptions): Promise<{ data: Note[], total: number }> {
        let rawNotes = await this.readFromFile();
        
        if (options?.tag) {
            rawNotes = rawNotes.filter((data: any) => data.tags.split(',').includes(options.tag));
        }
        
        const total = rawNotes.length;
        
        if (options?.skip !== undefined) {
            rawNotes = rawNotes.slice(options.skip);
        }
        if (options?.limit !== undefined) {
            rawNotes = rawNotes.slice(0, options.limit);
        }

        const data = rawNotes.map((data: any) => new Note(
            data.id,
            new Title(data.title),
            new Content(data.content),
            TagList.fromString(data.tags),
            new Email(data.reporter),
            new Date(data.createdAt),
            new Date(data.updateAt)
        ));
        
        return { data, total };
    }

    async findByID(id: string): Promise<Note | null> {
        const notes = await this.readFromFile();
        const noteData = notes.find(note => note.id === id);

        if (!noteData) return null;
        return new Note(
            noteData.id,
            new Title(noteData.title),
            new Content(noteData.content),
            TagList.fromString(noteData.tags),
            new Email(noteData.reporter),
            new Date(noteData.createdAt),
            new Date(noteData.updateAt)
        );
    }


    async delete(id: string): Promise<void> {
        const rawNotes = await this.readFromFile();

        const filteredNotes = rawNotes.filter(n => n.id !== id);

        if (rawNotes.length === filteredNotes.length) {
            throw new Error("Note to delete not found");
        }

        await this.writeToFile(filteredNotes);
    }


    async update(note: Note): Promise<void> {
        const rawNotes = await this.readFromFile();

        const index = rawNotes.findIndex(n => n.id === note.id);

        if (index === -1) {
            throw new Error("Note not found in data.json");
        }
        rawNotes[index] = {
            id: note.id,
            title: note.title.getValue(),
            content: note.content.getValue(),
            tags: note.tag.getValue().map(t => t.getValue()).join(','),
            reporter: note.reporter.getValue(),
            createdAt: note.createdAt,
            updateAt: note.updateAt
        };
        await this.writeToFile(rawNotes);
    }

    async getUniqueTags(): Promise<string[]> {
        const notes = await this.readFromFile();
        const tagSet = new Set<string>();
        
        notes.forEach(note => {
            if (note.tags) {
                note.tags.split(',').forEach((tag: string) => {
                    const trimmed = tag.trim();
                    if (trimmed) tagSet.add(trimmed);
                });
            }
        });
        
        return Array.from(tagSet);
    }
}
