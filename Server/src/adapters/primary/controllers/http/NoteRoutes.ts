import { Router } from "express";
import { NoteController } from "./NoteController";

export function createNoteRouter(controller: NoteController): Router {
    const router = Router();

    router.post("/notes", (req, res) => controller.create(req, res));
    router.get("/notes", (req, res) => controller.read(req, res));
    router.put("/notes/:id", (req, res) => controller.update(req, res));
    router.delete("/notes/:id", (req, res) => controller.delete(req, res));

    return router;
}
