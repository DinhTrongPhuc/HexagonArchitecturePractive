import { Router } from "express";
import { AllocationController } from "../controllers/http/AllocationController";

export const AllocationRoutes = (controller: AllocationController) => {
  const router = Router();

  router.post("/allocate", (req, res) => controller.allocate(req, res));

  return router;
};
