export interface CustomerInfo {
  phone?: string;
  name?: string;
  email?: string;
  locale?: string;
}

export interface CartItemSummary {
  id: string;
  title: string;
  variantTitle?: string;
  quantity: number;
  price: string;
  currencyCode: string;
  imageUrl?: string;
}

export interface AbandonedCartPayload {
  cartId: string;
  checkoutUrl: string;
  customer?: CustomerInfo;
  items: CartItemSummary[];
  totalAmount: string;
  currencyCode: string;
  totalQuantity: number;
  lastActiveAt?: number;
}

export interface NotificationResult {
  success: boolean;
  channel?: "webhook" | "whatsapp" | "mock" | "custom";
  providerResponse?: any;
  error?: string;
  messagePreview?: string;
}
