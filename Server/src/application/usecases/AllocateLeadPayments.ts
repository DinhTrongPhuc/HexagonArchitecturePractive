import {
  ExternalCrmPort,
  CrmVersion,
} from "../../ports/outbound/repositories/ExternalCrmPort";

export interface AllocateRequest {
  leadId: string;
  version: CrmVersion;
  isDryRun: boolean;
}

export interface AllocateResponse {
  logs: string[];
}

export class AllocateLeadPaymentsUseCase {
  constructor(private readonly crmPort: ExternalCrmPort) {}

  async execute(request: AllocateRequest): Promise<AllocateResponse> {
    const logs: string[] = [];
    const { leadId, version, isDryRun } = request;

    const log = (msg: string) => logs.push(msg);

    log(
      `Starting allocation for lead: ${leadId} (CRM: ${version}, Dry Run: ${isDryRun})`,
    );

    try {
      const order = await this.crmPort.getOrder(leadId, version);
      const { payments } = order;

      log(`Total payments found: ${payments.length}`);

      if (payments.length === 0) {
        log("No payments to process.");
        return { logs };
      }

      log(`\n--- Phase 1: Reset all allocations to zero ---`);
      for (const payment of payments) {
        log(`[Reset] id=${payment.id} to zero`);
        if (!isDryRun) {
          await this.crmPort.resetPayment(leadId, order, payment, version);
        } else {
          log(`  [DRY RUN] Would reset payment id=${payment.id}`);
        }
      }

      log(`\n--- Phase 2: Update allocations with amounts ---`);
      for (const [i, payment] of payments.entries()) {
        const isLast = i === payments.length - 1;
        log(
          `[Payment ${i + 1}/${payments.length}] id=${payment.id}, amount=${payment.amount}, isLast=${isLast}`,
        );

        if (!isDryRun) {
          const updatedId = await this.crmPort.updatePayment(
            leadId,
            order,
            payment,
            i,
            payments.length,
            version,
          );
          log(`  ✓ Update success, order ID: ${updatedId}`);
        } else {
          log(
            `  [DRY RUN] Would update payment id=${payment.id} with calculated amounts`,
          );
        }
      }

      log(
        `\n✓ Done. Successfully processed ${payments.length} payment(s) for lead ${leadId}`,
      );
      log(`Remaining in calculation: ${order.remaining}`);

      return { logs };
    } catch (error: any) {
      log(`❌ FAILED: ${error.message}`);
      return { logs };
    }
  }
}
