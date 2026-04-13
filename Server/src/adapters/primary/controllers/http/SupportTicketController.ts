import { Request, Response } from "express";
import {
    ScanSupportTicketsUseCase,
    type ScanSupportTicketsRequest,
} from "../../../../ports/inbound/usecases/ScanSupportTicketsUseCase";

export class SupportTicketController {
    constructor(
        private readonly scanSupportTicketsUseCase: ScanSupportTicketsUseCase,
    ) {}

    async scan(req: Request, res: Response) {
        const { searchPhrase, limit } = req.query;
        const request: ScanSupportTicketsRequest = {};
        const parsedLimit = this.parseLimit(limit);

        if (typeof searchPhrase === "string") {
            request.searchPhrase = searchPhrase;
        }

        if (parsedLimit !== undefined) {
            request.limit = parsedLimit;
        }

        const result = await this.scanSupportTicketsUseCase.execute(request);

        res.status(200).json(result);
    }

    private parseLimit(limit: Request["query"]["limit"]): number | undefined {
        if (typeof limit !== "string" || !limit.trim()) {
            return undefined;
        }

        const parsed = Number(limit);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
}
