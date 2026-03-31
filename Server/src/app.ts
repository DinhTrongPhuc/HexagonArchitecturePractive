import express from "express";

import { NoteController } from "./adapters/primary/controllers/http/NoteController";
import { NoteComand } from "./adapters/primary/controllers/CLI/NoteComand";
import { CreateNote } from "./application/usecases/CreateNote";
import { ReadListNote } from "./application/usecases/ReadListNote";
import { UpdateNote } from "./application/usecases/UpdateNote";
import { DeleteNote } from "./application/usecases/DeleteNote";

// router
import { createNoteRouter } from "./adapters/primary/controllers/http/NoteRoutes";

// stored data
import { JsonNoteRepository } from "./adapters/secondary/persistence/JsonNoteRepository";
import { InMemoryNoteRepository } from "./adapters/secondary/persistence/InMemoryNoteRepository";


export class App {
    static async bootstrap(args: string[]) {
        // 1. Khởi tạo Repository
        const noteRepository = new InMemoryNoteRepository();

        // 2. Khởi tạo UseCases
        const createNoteUseCase = new CreateNote(noteRepository);
        const readListNoteUseCase = new ReadListNote(noteRepository);
        const updateNoteUseCase = new UpdateNote(noteRepository);
        const deleteNoteUseCase = new DeleteNote(noteRepository);

        if (args.length > 0) {
            const noteComand = new NoteComand(createNoteUseCase, readListNoteUseCase, updateNoteUseCase, deleteNoteUseCase);
            await noteComand.run(args);
            process.exit(0);
        } else {
            const noteController = new NoteController(createNoteUseCase, readListNoteUseCase, updateNoteUseCase, deleteNoteUseCase);
            const server = express();
            server.use(express.json());
            server.use(createNoteRouter(noteController));

            server.listen(5000, () => console.log("Server is running on port 5000"));
        }
    }
}
