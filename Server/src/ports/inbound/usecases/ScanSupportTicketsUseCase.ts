import { ScannedSupportTicket } from "../../outbound/IEmailScannerPort";

export interface ScanSupportTicketsRequest {
    searchPhrase?: string;
    limit?: number;
}

export interface ScanSupportTicketsResponse {
    searchPhrase: string;
    total: number;
    tickets: ScannedSupportTicket[];
}

export interface ScanSupportTicketsUseCase {
    execute(
        request?: ScanSupportTicketsRequest,
    ): Promise<ScanSupportTicketsResponse>;
}
