import { Router } from "express";
import { NoteController } from "./NoteController";
import { validate } from "./middlewares/ValidationMiddleware";
import { createNoteSchema, updateNoteSchema } from "./validators/NoteValidator";

export function createNoteRouter(controller: NoteController): Router {
    const router = Router();

    router.post("/", validate(createNoteSchema), (req, res) => controller.create(req, res));
    router.get("/", (req, res) => controller.read(req, res));
    router.get("/meta/tags", (req, res) => controller.getTags(req, res));
    router.get("/:id", (req, res) => controller.readById(req, res));
    router.put("/:id", validate(updateNoteSchema), (req, res) => controller.update(req, res));
    router.delete("/:id", (req, res) => controller.delete(req, res));

    return router;
}


