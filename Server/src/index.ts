import express from "express";

import { NoteController } from "./adapters/primary/controllers/http/NoteController";
import { NoteComand } from "./adapters/primary/controllers/CLI/NoteComand";
import { CreateNote } from "./application/usecases/CreateNote";
import { ReadListNote } from "./application/usecases/ReadListNote";
import { UpdateNote } from "./application/usecases/UpdateNote";
import { DeleteNote } from "./application/usecases/DeleteNote";

// stored data
import { JsonNoteRepository } from "./adapters/secondary/persistence/JsonNoteRepository";
import { InMemoryNoteRepository } from "./adapters/secondary/persistence/InMemoryNoteRepository";
import { createNoteRouter } from "./adapters/primary/controllers/http/NoteRoutes";

// khởi tạo repository
const noteRepository = new JsonNoteRepository();

// khởi tạo usecase
const createNoteUseCase = new CreateNote(noteRepository);
const readListNoteUseCase = new ReadListNote(noteRepository);
const updateNoteUseCase = new UpdateNote(noteRepository);
const deleteNoteUseCase = new DeleteNote(noteRepository);

// truyền usecase vào controller và command
const noteController = new NoteController(createNoteUseCase, readListNoteUseCase, updateNoteUseCase, deleteNoteUseCase);
const noteComand = new NoteComand(createNoteUseCase, readListNoteUseCase, updateNoteUseCase, deleteNoteUseCase);

const args = process.argv.slice(2);

if (args.length > 0) {
    console.log("Comand cli running");
    (async () => {
        await noteComand.run(args);
    })();
} else {
    const app = express();
    const port = 5000;
    app.use(express.json());

    app.use(createNoteRouter(noteController));


    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
