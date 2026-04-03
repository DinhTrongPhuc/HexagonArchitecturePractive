import axios from "axios";
import { ExternalCrmPort, Order, Payment, CrmVersion } from "../../../ports/outbound/repositories/ExternalCrmPort";

const GRAPHQL_ENDPOINT_V2 = "https://gate-way.mindx.edu.vn/crm-api/graphql";
const GRAPHQL_ENDPOINT_V1 = "https://crm.api2.mindx.edu.vn/graphql";

const GET_ORDER_BY_LEAD_V2 = `
  query Order_getByLeadId($leadId: String) {
    Order_getByLeadId(leadId: $leadId) {
      payments { id amount status }
      productItems { id calculation { priceAfterDiscount } }
      calculation { remaining }
    }
  }
`;

const GET_ORDER_BY_LEAD_V1 = `
  query OrderGet($leadId: String!) {
    Order_get(leadId: $leadId) {
      payments { id amount status }
      productItems { id calculation { priceAfterDiscount } }
      calculation { remaining }
    }
  }
`;

const UPDATE_PAYMENT_ALLOCATION_V2 = `
  mutation Order_updatePaymentAllocation($payload: UpdatePaymentAllocationPayload) {
    Order_updatePaymentAllocation(payload: $payload) { id }
  }
`;

const UPDATE_PAYMENT_ALLOCATION_V1 = `
  mutation UpdatePaymentAllocation($payload: UpdatePaymentAllocationPayload!) {
    UpdatePaymentAllocation(payload: $payload) { 
    id 
    leadId
    }
  }
`;

export class MindXCrmAdapter implements ExternalCrmPort {
  private readonly token: string;

  constructor(token: string) {
    if (!token) throw new Error("CRM_TOKEN is not defined");
    this.token = token;
  }

  private buildHeaders(version: CrmVersion): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      "User-Agent": "Mozilla/5.0 (Node.js)",
      Accept: "application/json",
      "Content-Type": "application/json",
      Referer: version === "v2" ? "https://crm-v2.mindx.edu.vn/" : "https://crm.mindx.edu.vn/"
    };
  }

  async getOrder(leadId: string, version: CrmVersion): Promise<Order> {
    const operationName = version === "v1" ? "OrderGet" : "Order_getByLeadId";
    const query = version === "v1" ? GET_ORDER_BY_LEAD_V1 : GET_ORDER_BY_LEAD_V2;
    const endpoint = version === "v1" ? GRAPHQL_ENDPOINT_V1 : GRAPHQL_ENDPOINT_V2;

    const response = await axios.post(
      endpoint,
      { operationName, query, variables: { leadId } },
      { headers: this.buildHeaders(version) }
    );

    if (response.data?.errors) {
      throw new Error(`GraphQL error: ${JSON.stringify(response.data.errors)}`);
    }

    const order = version === "v1" ? response.data?.data?.Order_get : response.data?.data?.Order_getByLeadId;
    if (!order) throw new Error(`Order not found for leadId: ${leadId}`);

    return {
      payments: order.payments || [],
      productItemIds: (order.productItems || []).map((p: any) => p.id),
      productItemPrices: (order.productItems || []).map((p: any) => p.calculation?.priceAfterDiscount ?? 0),
      remaining: order.calculation?.remaining ?? 0,
    };
  }

  async resetPayment(leadId: string, order: Order, payment: Payment, version: CrmVersion): Promise<void> {
    const allocations = order.productItemIds.flatMap((id) => [
      { productItemId: id, amount: 0, purpose: "PRODUCT_ITEM_PRICE" },
      { productItemId: id, amount: 0, purpose: "TRANSFER_FEE" },
    ]);

    const payload = { leadId, paymentId: payment.id, paymentAllocations: allocations };
    const operationName = version === "v1" ? "UpdatePaymentAllocation" : "Order_updatePaymentAllocation";
    const query = version === "v1" ? UPDATE_PAYMENT_ALLOCATION_V1 : UPDATE_PAYMENT_ALLOCATION_V2;
    const endpoint = version === "v1" ? GRAPHQL_ENDPOINT_V1 : GRAPHQL_ENDPOINT_V2;

    const response = await axios.post(
      endpoint,
      { operationName, query, variables: { payload } },
      { headers: this.buildHeaders(version) }
    );

    if (response.data?.errors) {
      throw new Error(`Reset error for payment ${payment.id}: ${JSON.stringify(response.data.errors)}`);
    }
  }

  async updatePayment(
    leadId: string,
    order: Order,
    payment: Payment,
    index: number,
    total: number,
    version: CrmVersion
  ): Promise<string> {
    // const isLastPayment = index === total - 1;
    const allocations = this.buildAllocations(payment, order,
      // isLastPayment
    );
    const payload = { leadId, paymentId: payment.id, paymentAllocations: allocations };

    const operationName = version === "v1" ? "UpdatePaymentAllocation" : "Order_updatePaymentAllocation";
    const query = version === "v1" ? UPDATE_PAYMENT_ALLOCATION_V1 : UPDATE_PAYMENT_ALLOCATION_V2;
    const endpoint = version === "v1" ? GRAPHQL_ENDPOINT_V1 : GRAPHQL_ENDPOINT_V2;

    const response = await axios.post(
      endpoint,
      { operationName, query, variables: { payload } },
      { headers: this.buildHeaders(version) }
    );

    if (response.data?.errors) {
      throw new Error(`Update error for payment ${payment.id}: ${JSON.stringify(response.data.errors)}`);
    }

    return version === "v1"
      ? response.data?.data?.UpdatePaymentAllocation?.id
      : response.data?.data?.Order_updatePaymentAllocation?.id;
  }

  private buildAllocations(payment: Payment, order: Order,
    // isLastPayment: boolean
  ): any[] {
    const { productItemIds, productItemPrices, remaining } = order;
    let totalProductItemPrice = productItemPrices.reduce((sum, p) => sum + p, 0);
    let allocatedAmountSoFar = 0;

    return productItemIds.flatMap((id, index) => {
      let amount: number;
      const isLastItem = index === productItemIds.length - 1;

      if (payment.status === "CANCELLED" || payment.status === "canceled") {
        amount = 0;
      } else if (productItemIds.length === 1) {
        amount = payment.amount;
        // } else if (isLastPayment) {
        //   amount = remaining <= 0 ? payment.amount : 0;
      } else {
        if (isLastItem) {
          amount = payment.amount - allocatedAmountSoFar;
        } else {
          const productPrice = productItemPrices[index] || 0;
          const exactNumerator = payment.amount * productPrice;
          const exactVal = totalProductItemPrice > 0 ? exactNumerator / totalProductItemPrice : payment.amount / productItemIds.length;
          amount = Math.round(exactVal);
        }
      }

      allocatedAmountSoFar += amount;
      return [
        { productItemId: id, amount, purpose: "PRODUCT_ITEM_PRICE" as const },
        { productItemId: id, amount: 0, purpose: "TRANSFER_FEE" as const },
      ];
    });
  }
}
