import { Request, Response } from "express";

import { CreateNoteUseCase } from "../../../../ports/inbound/usecases/CreateNoteUseCase";
import { ListNoteUseCase } from "../../../../ports/inbound/usecases/ListNoteUseCase";
import { ReadNoteUseCase } from "../../../../ports/inbound/usecases/ReadNoteUseCase";
import { UpdateNoteUseCase } from "../../../../ports/inbound/usecases/UpdateNoteUseCase";
import { DeleteNoteUseCase } from "../../../../ports/inbound/usecases/DeleteNoteUseCase";
import { GetUniqueTagsUseCase } from "../../../../ports/inbound/usecases/GetUniqueTagsUseCase";

export class NoteController {
    constructor(
        private createNote: CreateNoteUseCase,
        private readListNote: ListNoteUseCase,
        private readNote: ReadNoteUseCase,
        private updateNote: UpdateNoteUseCase,
        private deleteNote: DeleteNoteUseCase,
        private getUniqueTags: GetUniqueTagsUseCase
    ) { }

    async create(req: Request, res: Response) {
        const { title, content, tags, reporter } = req.body;

        const tagsString = Array.isArray(tags) ? tags.join(',') : tags;

        const note = await this.createNote.execute(
            { title, content, tags: tagsString, reporter }
        );

        res.status(201).json({
            id: note.id,
            title: note.title.getValue(),
            content: note.content.getValue(),
            tags: note.tag.getValue().map((t: any) => t.getValue()),
            reporter: note.reporter.getValue(),
            createdAt: note.createdAt,
            updateAt: note.updateAt
        });
    }

    async read(req: Request, res: Response) {
        const { limit, page, tag } = req.query;
        let parsedLimit = limit ? parseInt(limit as string, 10) : undefined;
        let parsedSkip = undefined;
        
        if (parsedLimit && page) {
            const parsedPage = parseInt(page as string, 10);
            if (parsedPage > 0) {
                parsedSkip = (parsedPage - 1) * parsedLimit;
            }
        }
        
        const parsedTag = tag ? tag as string : undefined;

        const options: any = {};
        if (parsedLimit !== undefined) options.limit = parsedLimit;
        if (parsedSkip !== undefined) options.skip = parsedSkip;
        if (parsedTag !== undefined) options.tag = parsedTag;

        const result = await this.readListNote.execute(options);
        res.status(200).json(result);
    }

    async readById(req: Request, res: Response) {
        const id = req.params.id as string;

        const note = await this.readNote.execute(id);
        res.status(200).json(note);
    }

    async update(req: Request, res: Response) {
        const id = req.params.id as string;
        const { title, content, tags, reporter } = req.body;

        const tagsString = Array.isArray(tags) ? tags.join(',') : tags;

        const note = await this.updateNote.execute(
            { id, title, content, tags: tagsString, reporter }
        );

        res.status(200).json({
            id: note.id,
            title: note.title.getValue(),
            content: note.content.getValue(),
            tags: note.tag.getValue().map((t: any) => t.getValue()),
            reporter: note.reporter.getValue(),
            createdAt: note.createdAt,
            updateAt: note.updateAt
        });
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id as string;

        await this.deleteNote.execute(id);
        res.status(200).json({ message: "Note deleted successfully" });
    }

    async getTags(req: Request, res: Response) {
        try {
            const tags = await this.getUniqueTags.execute();
            res.status(200).json(tags);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}