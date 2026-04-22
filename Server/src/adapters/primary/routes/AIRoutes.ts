import { Router } from "express";
import { AIController } from "../controllers/http/ai/AIController";

export const AIRoutes = (controller: AIController) => {
    const router = Router();

    router.post("/ask", (req, res) => controller.ask(req, res));

    return router;
};
