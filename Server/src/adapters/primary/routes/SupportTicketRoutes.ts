import { Router } from "express";
import { SupportTicketController } from "../controllers/http/SupportTicketController";

export const SupportTicketRoutes = (controller: SupportTicketController) => {
    const router = Router();

    router.get("/support-tickets/scan", (req, res) => controller.scan(req, res));

    return router;
};
