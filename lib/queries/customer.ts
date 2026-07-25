import { customerAccountFetch } from "@/lib/shopify";
import type { Customer, Order, MailingAddress } from "@/types/shopify";

export async function getCustomer(accessToken: string): Promise<Customer | null> {
  const data = await customerAccountFetch<{ customer: Customer }>(
    `query Customer { customer { id firstName lastName email phone displayName } }`,
    {},
    accessToken
  );
  return data?.customer ?? null;
}

export async function getCustomerOrders(accessToken: string, first = 20): Promise<Order[] | null> {
  const data = await customerAccountFetch<{ customer: { orders: { edges: { node: Order }[] } } }>(
    `query CustomerOrders($first: Int!) {
      customer { orders(first: $first) {
        edges { node {
          id name orderNumber processedAt financialStatus fulfillmentStatus
          totalPrice { amount currencyCode }
          customerUrl
          lineItems(first: 5) { edges { node { title quantity image { url altText } } } }
        } }
      } }
    }`,
    { first },
    accessToken
  );
  return data?.customer.orders.edges.map((e) => e.node) ?? null;
}

export async function getCustomerAddresses(accessToken: string, first = 10): Promise<MailingAddress[] | null> {
  const data = await customerAccountFetch<{ customer: { addresses: { edges: { node: MailingAddress }[] } } }>(
    `query CustomerAddresses($first: Int!) {
      customer { addresses(first: $first) {
        edges { node {
          id firstName lastName company address1 address2 city zone zip country phone
          formatted isDefault
        } }
      } }
    }`,
    { first },
    accessToken
  );
  return data?.customer.addresses.edges.map((e) => e.node) ?? null;
}

// Storefront API registration (customerCreate) — works without Customer Account API
import { shopifyFetch } from "@/lib/shopify";

export async function createCustomer(input: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
}): Promise<{ customer: { id: string } | null; customerUserErrors: { message: string; code?: string }[] } | null> {
  const data = await shopifyFetch<{
    customerCreate: {
      customer: { id: string } | null;
      customerUserErrors: { message: string; code?: string }[];
    };
  }>(
    `mutation CustomerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id }
        customerUserErrors { message code }
      }
    }`,
    { input },
    { cache: "no-store" }
  );
  return data?.customerCreate ?? null;
}
