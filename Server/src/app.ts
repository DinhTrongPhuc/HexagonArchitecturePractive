import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

import { NoteController } from "./adapters/primary/controllers/http/NoteController";
import { NoteComand } from "./adapters/primary/controllers/CLI/NoteComand";
import { CreateNote } from "./application/usecases/CreateNote";
import { ReadListNote } from "./application/usecases/ReadListNote";
import { ReadNote } from "./application/usecases/ReadNote";
import { UpdateNote } from "./application/usecases/UpdateNote";
import { DeleteNote } from "./application/usecases/DeleteNote";
import { NoteRepository } from "./ports/outbound/repositories/NoteRepository";

// router
import { createNoteRouter } from "./adapters/primary/controllers/http/NoteRoutes";
import { errorHandler } from "./adapters/primary/controllers/http/middlewares/ErrorHandler";

// stored data
import { JsonNoteRepository } from "./adapters/secondary/persistence/JsonNoteRepository";
import { InMemoryNoteRepository } from "./adapters/secondary/persistence/InMemoryNoteRepository";
import { MongoDBNoteRepository } from "./adapters/secondary/persistence/MongGoDBRepository";

//automation tools
import { MindXCrmAdapter } from "./adapters/secondary/external/MindXCrmAdapter";
import { GraphEmailAdapter } from "./adapters/secondary/external/GraphEmailAdapter";
import { AllocateLeadPaymentsUseCase } from "./application/usecases/AllocateLeadPayments";
import { ScanSupportTicketsUseCase } from "./application/usecases/ScanSupportTicketsUseCase";
import { AllocationController } from "./adapters/primary/controllers/http/AllocationController";
import { SupportTicketController } from "./adapters/primary/controllers/http/SupportTicketController";
import { AllocationRoutes } from "./adapters/primary/routes/AllocationRoutes";
import { SupportTicketRoutes } from "./adapters/primary/routes/SupportTicketRoutes";

//express
const server = express();
server.use(cors());
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
            const readNoteUseCase = new ReadNote(noteRepository);
            const updateNoteUseCase = new UpdateNote(noteRepository);
            const deleteNoteUseCase = new DeleteNote(noteRepository);

            const crmAdapter = new MindXCrmAdapter(process.env.CRM_TOKEN!);
            const allocateUseCase = new AllocateLeadPaymentsUseCase(crmAdapter);
            const emailScannerAdapter = new GraphEmailAdapter();
            const scanSupportTicketsUseCase = new ScanSupportTicketsUseCase(emailScannerAdapter);

            // 3. Khởi tạo Controller hoặc Command
            if (args.length > 0) {
                // Command might break here if it hasn't been updated to accept readNoteUseCase, we will ignore it for now or assume it takes 4 args only. Wait, if NoteComand was using 4 args, I might break it. 
                // Let's pass the 5th arg but wait, `NoteComand` constructor might only accept 4. I will leave NoteComand intact unless error. Wait, in TS compile error will happen.
                const noteComand = new NoteComand(createNoteUseCase, readListNoteUseCase, updateNoteUseCase, deleteNoteUseCase);
                await noteComand.run(args);
                if (mongoClient) {
                    await mongoClient.close();
                }
                process.exit(0);
            } else {
                const noteController = new NoteController(createNoteUseCase, readListNoteUseCase, readNoteUseCase, updateNoteUseCase, deleteNoteUseCase);
                const allocationController = new AllocationController(allocateUseCase);
                const supportTicketController = new SupportTicketController(scanSupportTicketsUseCase);

                server.use(createNoteRouter(noteController));
                server.use(AllocationRoutes(allocationController));
                server.use(SupportTicketRoutes(supportTicketController));

                // Add Global Error Handler Middleware after all routes
                server.use(errorHandler);

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
