import { Request, Response } from "express";
import { AllocateLeadPaymentsUseCase } from "../../../../application/usecases/AllocateLeadPayments";

export class AllocationController {
  constructor(private readonly allocateUseCase: AllocateLeadPaymentsUseCase) {}

  async allocate(req: Request, res: Response) {
    const { leadId, dryRun, crmVersion } = req.body;

    if (!leadId) {
      return res.status(400).json({ error: "leadId is required" });
    }

    try {
      const response = await this.allocateUseCase.execute({
        leadId,
        isDryRun: dryRun === true,
        version: (crmVersion as any) || "v2",
      });

      return res.status(200).json(response);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
