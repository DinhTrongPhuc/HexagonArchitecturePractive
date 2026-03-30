import { Request, Response } from "express";

import { CreateNoteUseCase } from "../../../../ports/inbound/usecases/CreateNoteUseCase";
import { ListNoteUseCase } from "../../../../ports/inbound/usecases/ListNoteUseCase";
import { UpdateNoteUseCase } from "../../../../ports/inbound/usecases/UpdateNoteUseCase";
import { DeleteNoteUseCase } from "../../../../ports/inbound/usecases/DeleteNoteUseCase";

export class NoteController {
    constructor(
        private createNote: CreateNoteUseCase,
        private readListNote: ListNoteUseCase,
        private updateNote: UpdateNoteUseCase,
        private deleteNote: DeleteNoteUseCase
    ) { }

    async create(req: Request, res: Response) {
        try {
            const { title, content, tags, reporter } = req.body;

            const note = await this.createNote.execute(
                { title, content, tags, reporter }
            );

            res.status(201).json(note);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async read(req: Request, res: Response) {
        try {
            const notes = await this.readListNote.execute();
            res.status(200).json(notes);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, content, tags, reporter } = req.body;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: "ID is required on URL" });
            }

            const note = await this.updateNote.execute(
                { id, title, content, tags, reporter }
            );

            res.status(200).json(note);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ error: "ID is required and must be a string" });
            }
            await this.deleteNote.execute(id);
            res.status(200).json({ message: "Note deleted successfully" });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}