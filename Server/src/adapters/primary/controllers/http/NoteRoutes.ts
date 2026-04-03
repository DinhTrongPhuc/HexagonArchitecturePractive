import { Router } from "express";
import { NoteController } from "./NoteController";
import { validate } from "./middlewares/ValidationMiddleware";
import { createNoteSchema, updateNoteSchema } from "./validators/NoteValidator";

export function createNoteRouter(controller: NoteController): Router {
    const router = Router();

    router.post("/notes", validate(createNoteSchema), (req, res) => controller.create(req, res));
    router.get("/notes", (req, res) => controller.read(req, res));
    router.get("/notes/:id", (req, res) => controller.readById(req, res));
    router.put("/notes/:id", validate(updateNoteSchema), (req, res) => controller.update(req, res));
    router.delete("/notes/:id", (req, res) => controller.delete(req, res));

    return router;
}


