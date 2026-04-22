import { Request, Response } from "express";
import {
    ScanSupportTicketsUseCase,
    type ScanSupportTicketsRequest,
} from "../../../../ports/inbound/usecases/ScanSupportTicketsUseCase";
import { AutoScanService } from "../../../../application/services/AutoScanService";

export class SupportTicketController {
    constructor(
        private readonly scanSupportTicketsUseCase: ScanSupportTicketsUseCase,
        private readonly autoScanService: AutoScanService
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

    async startAuto(req: Request, res: Response) {
        const started = this.autoScanService.startAutoScan();
        res.status(200).json({ success: started, message: started ? 'Auto scanning started' : 'Auto scan already running' });
    }

    async stopAuto(req: Request, res: Response) {
        const stopped = this.autoScanService.stopAutoScan();
        res.status(200).json({ success: stopped, message: stopped ? 'Auto scanning stopped' : 'Auto scan is not running' });
    }

    async getAutoStatus(req: Request, res: Response) {
        res.status(200).json(this.autoScanService.getStatus());
    }

    private parseLimit(limit: Request["query"]["limit"]): number | undefined {
        if (typeof limit !== "string" || !limit.trim()) {
            return undefined;
        }

        const parsed = Number(limit);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
}
