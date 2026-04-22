export type CrmVersion = "v1" | "v2";

export type Payment = {
  id: string;
  amount: number;
  status: string;
};

export type Order = {
  payments: Payment[];
  productItemIds: string[];
  productItemPrices: number[];
  remaining: number;
};

export interface ExternalCrmPort {
  getOrder(leadId: string, version: CrmVersion): Promise<Order>;
  resetPayment(leadId: string, order: Order, payment: Payment, version: CrmVersion): Promise<void>;
  updatePayment(leadId: string, order: Order, payment: Payment, index: number, total: number, version: CrmVersion): Promise<string>;
}
