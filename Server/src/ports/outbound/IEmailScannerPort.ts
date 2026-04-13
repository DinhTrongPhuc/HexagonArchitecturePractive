export interface EmailLink {
    text: string;
    href: string;
}

export interface ScannedSupportTicket {
    id: string;
    conversationId?: string;
    subject: string;
    bodyPreview: string;
    bodyContent?: string;
    webLink?: string;
    receivedAt?: string;
    senderName?: string;
    senderAddress?: string;
    links: EmailLink[];
    matchedQuery: string;
}

export interface ScanSupportTicketsRequest {
    searchPhrase: string;
    limit?: number;
    includeBodyContent?: boolean;
    senderAddress?: string;
}

export interface IEmailScannerPort {
    scanSupportTickets(
        request: ScanSupportTicketsRequest,
    ): Promise<ScannedSupportTicket[]>;
}
