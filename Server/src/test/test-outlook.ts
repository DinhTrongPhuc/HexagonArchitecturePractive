import dotenv from "dotenv";
import { GraphEmailAdapter } from "../adapters/secondary/external/GraphEmailAdapter";
import { ScanSupportTicketsUseCase } from "../application/usecases/ScanSupportTicketsUseCase";

dotenv.config();

const testOutlookDesktopConnection = async () => {
    const emailScanner = new GraphEmailAdapter();
    const scanSupportTickets = new ScanSupportTicketsUseCase(emailScanner);

    try {
        const searchPhrase = process.env.OUTLOOK_SEARCH_PHRASE || "xem phiếu hỗ trợ";
        const limit = process.env.OUTLOOK_SEARCH_LIMIT
            ? Number(process.env.OUTLOOK_SEARCH_LIMIT)
            : 5;

        console.log(`Scanning Outlook with Graph $search: "${searchPhrase}"`);
        const result = await scanSupportTickets.execute({ searchPhrase, limit });

        if (result.tickets.length === 0) {
            console.log("No matching emails found.");
            return;
        }

        result.tickets.forEach((email, index) => {
            console.log(`\n--- Email #${index + 1} ---`);
            console.log(
                `From: ${email.senderAddress || "unknown"} (${email.senderName || "unknown"})`,
            );
            console.log(`Subject: ${email.subject}`);
            console.log(`Preview: ${email.bodyPreview}`);
            console.log(`Received: ${email.receivedAt || "unknown"}`);

            if (email.links.length > 0) {
                console.log(
                    "Links found in email:",
                    email.links.slice(0, 3).map((link) => `[${link.text}] -> ${link.href}`),
                    "...",
                );
            }
        });

        console.log(`\nMail scan completed. Found ${result.total} matching email(s).`);
    } catch (error) {
        console.error("\nMail scan failed:", error);
    }
};

testOutlookDesktopConnection();
