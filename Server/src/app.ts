import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

import { NoteController } from "./adapters/primary/controllers/http/NoteController";
import { NoteComand } from "./adapters/primary/controllers/CLI/NoteComand";
import { CreateNote } from "./application/usecases/CreateNote";
import { ReadListNote } from "./application/usecases/ReadListNote";
import { UpdateNote } from "./application/usecases/UpdateNote";
import { DeleteNote } from "./application/usecases/DeleteNote";
import { NoteRepository } from "./ports/outbound/repositories/NoteRepository";

// router
import { createNoteRouter } from "./adapters/primary/controllers/http/NoteRoutes";

// stored data
import { JsonNoteRepository } from "./adapters/secondary/persistence/JsonNoteRepository";
import { InMemoryNoteRepository } from "./adapters/secondary/persistence/InMemoryNoteRepository";
import { MongoDBNoteRepository } from "./adapters/secondary/persistence/MongGoDBRepository";

//express
const server = express();
server.use(express.json());

//env
dotenv.config();

export class App {
    static async bootstrap(args: string[]) {
        const repoType = process.env.REPO_TYPE || "JSON"; // Lấy từ .env, mặc định là JSON
        let noteRepository: NoteRepository;
        let mongoClient: MongoClient | null = null;

        try {
            // 1. Khởi tạo Repository
            if (repoType === "MONGODB") {
                mongoClient = new MongoClient(process.env.MONGODB_URI!);
                await mongoClient.connect();
                console.log("🍃 MongoDB Repository selected");
                noteRepository = new MongoDBNoteRepository(mongoClient);
            } else if (repoType === "JSON") {
                console.log("📂 JSON File Repository selected");
                noteRepository = new JsonNoteRepository();
            } else if (repoType === "MEMORY") {
                console.log("🧠 In-Memory Repository selected");
                noteRepository = new InMemoryNoteRepository();
            } else {
                throw new Error("Invalid repository type");
            }

            // 2. Khởi tạo Use Cases
            const createNoteUseCase = new CreateNote(noteRepository);
            const readListNoteUseCase = new ReadListNote(noteRepository);
            const updateNoteUseCase = new UpdateNote(noteRepository);
            const deleteNoteUseCase = new DeleteNote(noteRepository);

            // 3. Khởi tạo Controller hoặc Command
            if (args.length > 0) {
                const noteComand = new NoteComand(createNoteUseCase, readListNoteUseCase, updateNoteUseCase, deleteNoteUseCase);
                await noteComand.run(args);
                if (mongoClient) {
                    await mongoClient.close();
                }
                process.exit(0);
            } else {
                const noteController = new NoteController(createNoteUseCase, readListNoteUseCase, updateNoteUseCase, deleteNoteUseCase);

                server.use(createNoteRouter(noteController));

                server.listen(process.env.PORT, () => {
                    console.log(`Server is running on port ${process.env.PORT}`);
                    if (mongoClient) {
                        console.log(`MongoDB connected: ${mongoClient.db().databaseName}`);
                    }
                });
            }
        } catch (error) {
            console.log(error);
            if (mongoClient) {
                await mongoClient.close();
            }
            process.exit(1);
        }

    }
}
