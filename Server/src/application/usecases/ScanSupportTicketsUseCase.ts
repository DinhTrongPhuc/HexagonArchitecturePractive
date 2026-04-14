import {
    IEmailScannerPort,
    type ScannedSupportTicket,
} from "../../ports/outbound/IEmailScannerPort";
import {
    type ScanSupportTicketsRequest,
    type ScanSupportTicketsResponse,
    type ScanSupportTicketsUseCase as IScanSupportTicketsUseCase,
} from "../../ports/inbound/usecases/ScanSupportTicketsUseCase";

const DEFAULT_SEARCH_PHRASE = "xem phiếu hỗ trợ";
const DEFAULT_LIMIT = 10;

export class ScanSupportTicketsUseCase
    implements IScanSupportTicketsUseCase
{
    constructor(private readonly emailScannerPort: IEmailScannerPort) {}

    async execute(
        request: ScanSupportTicketsRequest = {},
    ): Promise<ScanSupportTicketsResponse> {
        const searchPhrase = request.searchPhrase?.trim() || DEFAULT_SEARCH_PHRASE;
        const limit = this.normalizeLimit(request.limit);

        const tickets = await this.emailScannerPort.scanSupportTickets({
            searchPhrase,
            limit,
            includeBodyContent: true,
            unreadOnly: true,
            ...(process.env.OUTLOOK_TARGET_MAILBOX
                ? { senderAddress: process.env.OUTLOOK_TARGET_MAILBOX }
                : {}),
        });

        return {
            searchPhrase,
            total: tickets.length,
            tickets: this.sortNewestFirst(tickets),
        };
    }

    private normalizeLimit(limit?: number): number {
        if (!limit || Number.isNaN(limit)) {
            return DEFAULT_LIMIT;
        }

        return Math.min(Math.max(Math.trunc(limit), 1), 50);
    }

    private sortNewestFirst(
        tickets: ScannedSupportTicket[],
    ): ScannedSupportTicket[] {
        return [...tickets].sort((a, b) => {
            const aTime = a.receivedAt ? new Date(a.receivedAt).getTime() : 0;
            const bTime = b.receivedAt ? new Date(b.receivedAt).getTime() : 0;
            return bTime - aTime;
        });
    }
}
