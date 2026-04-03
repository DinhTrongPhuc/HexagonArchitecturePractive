import { Request, Response } from "express";

import { CreateNoteUseCase } from "../../../../ports/inbound/usecases/CreateNoteUseCase";
import { ListNoteUseCase } from "../../../../ports/inbound/usecases/ListNoteUseCase";
import { ReadNoteUseCase } from "../../../../ports/inbound/usecases/ReadNoteUseCase";
import { UpdateNoteUseCase } from "../../../../ports/inbound/usecases/UpdateNoteUseCase";
import { DeleteNoteUseCase } from "../../../../ports/inbound/usecases/DeleteNoteUseCase";

export class NoteController {
    constructor(
        private createNote: CreateNoteUseCase,
        private readListNote: ListNoteUseCase,
        private readNote: ReadNoteUseCase,
        private updateNote: UpdateNoteUseCase,
        private deleteNote: DeleteNoteUseCase
    ) { }

    async create(req: Request, res: Response) {
        const { title, content, tags, reporter } = req.body;

        const note = await this.createNote.execute(
            { title, content, tags, reporter }
        );

        res.status(201).json(note);
    }

    async read(req: Request, res: Response) {
        const notes = await this.readListNote.execute();
        res.status(200).json(notes);
    }

    async readById(req: Request, res: Response) {
        const id = req.params.id as string;

        const note = await this.readNote.execute(id);
        res.status(200).json(note);
    }

    async update(req: Request, res: Response) {
        const id = req.params.id as string;
        const { title, content, tags, reporter } = req.body;

        const note = await this.updateNote.execute(
            { id, title, content, tags, reporter }
        );

        res.status(200).json(note);
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id as string;

        await this.deleteNote.execute(id);
        res.status(200).json({ message: "Note deleted successfully" });
    }
}