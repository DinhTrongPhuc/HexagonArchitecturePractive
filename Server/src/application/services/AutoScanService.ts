import { ScanSupportTicketsUseCase } from "../usecases/ScanSupportTicketsUseCase";
import { GraphEmailAdapter } from "../../adapters/secondary/external/GraphEmailAdapter";

export class AutoScanService {
    private isScanning: boolean = false;
    private timerId: NodeJS.Timeout | null = null;

    constructor(private readonly scanSupportTicketsUseCase: ScanSupportTicketsUseCase) {}

    public startAutoScan(intervalMs: number = 300000): boolean { // Mặc định 5 phút
        if (this.isScanning) {
            console.log("Auto scan is already running.");
            return false;
        }

        this.isScanning = true;
        
        // Chạy ngay lập tức lần đầu tiên
        this.runScanJob();

        // Đặt lịch lặp lại sau mỗi intervalMs
        this.timerId = setInterval(() => {
            if (this.isScanning) {
                this.runScanJob();
            }
        }, intervalMs);

        console.log(`Auto scan started with interval ${intervalMs}ms`);
        return true;
    }

    public stopAutoScan(): boolean {
        if (!this.isScanning) {
            console.log("Auto scan is not running.");
            return false;
        }
        
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        
        this.isScanning = false;
        console.log("Auto scan stopped.");
        return true;
    }

    public getStatus(): { isScanning: boolean } {
        return { isScanning: this.isScanning };
    }

    private async runScanJob() {
        console.log("[AutoScanService] Running automated email scan job...");
        try {
            const limit = process.env.OUTLOOK_SEARCH_LIMIT ? Number(process.env.OUTLOOK_SEARCH_LIMIT) : 5;
            const searchPhrase = process.env.OUTLOOK_SEARCH_PHRASE || "xem phiếu hỗ trợ";
            
            const result = await this.scanSupportTicketsUseCase.execute({ searchPhrase, limit });
            
            console.log(`[AutoScanService] Scan complete. Found ${result.total} matching emails.`);
            
            if (result.total > 0) {
                console.log("[AutoScanService] TO-DO: Call a UseCase here to save these emails as Tickets/Notes to MongoDB");
                // TODO: this.createTicketUseCase.execute(result.tickets)
            }
        } catch (error) {
            console.error("[AutoScanService] Automated email scan job failed:", error);
        }
    }
}
