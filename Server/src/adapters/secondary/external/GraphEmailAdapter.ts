import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
import * as cheerio from "cheerio";
import { MsalTokenCache } from "./MsalTokenCache";
import {
    type EmailLink,
    IEmailScannerPort,
    type ScanSupportTicketsRequest,
    type ScannedSupportTicket,
} from "../../../ports/outbound/IEmailScannerPort";

interface GraphEmailAdapterOptions {
    clientId?: string;
    tenantId?: string;
    accountIdentifier?: string;
    cacheFilePath?: string;
}

interface GraphMessage {
    id: string;
    conversationId?: string;
    subject?: string;
    bodyPreview?: string;
    webLink?: string;
    receivedDateTime?: string;
    from?: {
        emailAddress?: {
            address?: string;
            name?: string;
        };
    };
    body?: {
        content?: string;
    };
    isRead?: boolean;
}

interface GraphMessagesResponse {
    value?: GraphMessage[];
    "@odata.nextLink"?: string;
}

export class GraphEmailAdapter implements IEmailScannerPort {
    private readonly authCache: MsalTokenCache;

    constructor(options: GraphEmailAdapterOptions = {}) {
        const clientId = options.clientId ?? process.env.OUTLOOK_CLIENT_ID ?? "";
        const tenantId = options.tenantId ?? process.env.OUTLOOK_TENANT_ID ?? "";
        const accountIdentifier =
            options.accountIdentifier ?? process.env.OUTLOOK_ACCOUNT;

        this.authCache = new MsalTokenCache({
            clientId,
            tenantId,
            scopes: ["user.read", "mail.read"],
            ...(accountIdentifier ? { accountIdentifier } : {}),
            ...(options.cacheFilePath
                ? { cacheFilePath: options.cacheFilePath }
                : {}),
            deviceCodeCallback: (response) => {
                console.log("\n=================== AUTH REQUIRED ===================");
                console.log("Open:", response.verificationUri);
                console.log("Code:", response.userCode);
                console.log("====================================================\n");
            },
        });
    }

    async scanSupportTickets(
        request: ScanSupportTicketsRequest,
    ): Promise<ScannedSupportTicket[]> {
        const searchPhrase = request.searchPhrase.trim();
        if (!searchPhrase) {
            throw new Error("searchPhrase is required");
        }

        const senderAddress = request.senderAddress?.trim().toLowerCase();

        const accessToken = await this.authCache.getAccessToken();
        const client = Client.init({
            authProvider: (done) => done(null, accessToken),
        });

        const limit = this.normalizeLimit(request.limit);
        const messages = await this.fetchMatchingMessages(
            client,
            searchPhrase,
            senderAddress,
            limit,
            request.unreadOnly === true,
        );

        return messages
            .map((message) =>
                this.mapMessage(
                    message,
                    searchPhrase,
                    request.includeBodyContent === true,
                ),
            );
    }

    private mapMessage(
        message: GraphMessage,
        matchedQuery: string,
        includeBodyContent: boolean,
    ): ScannedSupportTicket {
        const links = this.extractLinks(message.body?.content);

        return {
            id: message.id,
            ...(message.conversationId
                ? { conversationId: message.conversationId }
                : {}),
            subject: message.subject ?? "(no subject)",
            bodyPreview: message.bodyPreview ?? "",
            ...(includeBodyContent && message.body?.content
                ? { bodyContent: message.body.content }
                : {}),
            ...(message.webLink ? { webLink: message.webLink } : {}),
            ...(message.receivedDateTime
                ? { receivedAt: message.receivedDateTime }
                : {}),
            ...(message.from?.emailAddress?.name
                ? { senderName: message.from.emailAddress.name }
                : {}),
            ...(message.from?.emailAddress?.address
                ? { senderAddress: message.from.emailAddress.address }
                : {}),
            ...(typeof message.isRead === "boolean"
                ? { isRead: message.isRead }
                : {}),
            links,
            matchedQuery,
        };
    }

    private extractLinks(bodyContent?: string): EmailLink[] {
        if (!bodyContent) {
            return [];
        }

        const $ = cheerio.load(bodyContent);
        const links: EmailLink[] = [];

        $("a").each((_, element) => {
            const href = $(element).attr("href")?.trim();
            if (!href) {
                return;
            }

            links.push({
                text: $(element).text().trim() || href,
                href,
            });
        });

        return links;
    }

    private buildSearchExpression(searchPhrase: string): string {
        const escaped = searchPhrase.replace(/"/g, '\\"').trim();
        return `"${escaped}"`;
    }

    private async fetchMatchingMessages(
        client: Client,
        searchPhrase: string,
        senderAddress: string | undefined,
        limit: number,
        unreadOnly: boolean,
    ): Promise<GraphMessage[]> {
        const matches: GraphMessage[] = [];
        const seenIds = new Set<string>();
        const pageSize = this.resolveFetchBatchSize(
            limit,
            !!senderAddress || unreadOnly,
        );
        let nextLink: string | undefined;
        let page = 0;

        while (matches.length < limit && page < 10) {
            page += 1;

            const response = nextLink
                ? ((await client
                      .api(nextLink)
                      .header("ConsistencyLevel", "eventual")
                      .header('Prefer', 'outlook.body-content-type="html"')
                      .get()) as GraphMessagesResponse)
                : ((await client
                      .api("/me/messages")
                      .header("ConsistencyLevel", "eventual")
                      .header('Prefer', 'outlook.body-content-type="html"')
                      .query({
                          $search: this.buildSearchExpression(searchPhrase),
                          $top: pageSize.toString(),
                          $select: [
                              "id",
                              "conversationId",
                              "subject",
                              "bodyPreview",
                              "body",
                              "from",
                              "isRead",
                              "receivedDateTime",
                              "webLink",
                          ].join(","),
                      })
                      .get()) as GraphMessagesResponse);

            const filteredMessages = (response.value ?? []).filter((message) => {
                if (seenIds.has(message.id)) {
                    return false;
                }

                seenIds.add(message.id);
                return (
                    this.matchesSender(message, senderAddress) &&
                    this.matchesUnreadFilter(message, unreadOnly)
                );
            });

            matches.push(...filteredMessages);
            nextLink = response["@odata.nextLink"];

            if (!nextLink) {
                break;
            }
        }

        return matches.slice(0, limit);
    }

    private matchesSender(
        message: GraphMessage,
        senderAddress?: string,
    ): boolean {
        if (!senderAddress) {
            return true;
        }

        return (
            message.from?.emailAddress?.address?.trim().toLowerCase() ===
            senderAddress
        );
    }

    private matchesUnreadFilter(
        message: GraphMessage,
        unreadOnly?: boolean,
    ): boolean {
        if (!unreadOnly) {
            return true;
        }

        return message.isRead === false;
    }

    private normalizeLimit(limit?: number): number {
        if (!limit || Number.isNaN(limit)) {
            return 10;
        }

        return Math.min(Math.max(Math.trunc(limit), 1), 50);
    }

    private resolveFetchBatchSize(limit: number, hasSenderFilter: boolean): number {
        if (!hasSenderFilter) {
            return limit;
        }

        return Math.min(Math.max(limit * 5, 10), 50);
    }
}
