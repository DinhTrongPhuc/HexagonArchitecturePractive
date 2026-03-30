import { Request, Response } from "express";
import { CreateNoteUseCase } from "../../ports/inbound/CreateNoteUseCase";
import { ListNoteUsecase } from "../../ports/inbound/ListNoteUsecase";

export class NoteController {
    constructor(
        private createNote: CreateNoteUseCase,
        private readListNote: ListNoteUsecase
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
}