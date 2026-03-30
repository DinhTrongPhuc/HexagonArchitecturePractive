import express from "express";

import { NoteController } from "./adapters/primary/NoteController";
import { NoteComand } from "./adapters/primary/NoteComand";
import { CreateNote } from "./application/usecases/CreateNote";
import { ReadListNote } from "./application/usecases/ReadListNote";

// stored data
import { JsonNoteRepository } from "./adapters/secondary/JsonNoteRepository";
import { InMemoryNoteRepository } from "./adapters/secondary/InMemoryNoteRepository";

const app = express();
const port = 5000;
app.use(express.json());

// khởi tạo repository
const noteRepository = new InMemoryNoteRepository();

// khởi tạo usecase
const createNoteUseCase = new CreateNote(noteRepository);
const readListNoteUseCase = new ReadListNote(noteRepository);

// truyền usecase vào controller và command
const noteController = new NoteController(createNoteUseCase, readListNoteUseCase);
const noteComand = new NoteComand(createNoteUseCase, readListNoteUseCase);

const args = process.argv.slice(2);

if (args.length > 0) {
    console.log("Comand cli running");
    (async () => {
        await noteComand.run(args);
    })();
} else {
    console.log("Web server running");
    app.post("/notes", (req, res) => noteController.create(req, res));
    app.get("/notes", (req, res) => noteController.read(req, res));

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
