import { Router } from "express";
import { SupportTicketController } from "../controllers/http/SupportTicketController";

export const SupportTicketRoutes = (controller: SupportTicketController) => {
    const router = Router();

    router.get("/support-tickets/scan", (req, res) => controller.scan(req, res));
    
    // Auto scan routing
    router.post("/support-tickets/auto/start", (req, res) => controller.startAuto(req, res));
    router.post("/support-tickets/auto/stop", (req, res) => controller.stopAuto(req, res));
    router.get("/support-tickets/auto/status", (req, res) => controller.getAutoStatus(req, res));

    return router;
};
