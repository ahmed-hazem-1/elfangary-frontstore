export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface Seo {
  title?: string | null;
  description?: string | null;
}

export interface Metafield {
  key: string;
  namespace?: string | null;
  value: string;
  type?: string | null;
  reference?: { image?: { url: string; altText?: string | null } | null } | null;
}

export interface MediaImage {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ProductImage {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  selectedOptions: SelectedOption[];
  price: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
  image?: { url: string; altText?: string | null } | null;
  sku?: string | null;
  weight?: number | null;
  unitPrice?: MoneyV2 | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  vendor?: string | null;
  productType?: string | null;
  tags: string[];
  availableForSale: boolean;
  featuredImage?: MediaImage | null;
  images?: { edges: { node: ProductImage }[] } | ProductImage[];
  media?: { edges: { node: { image?: MediaImage | null } }[] };
  variants: {
    edges: { node: ProductVariant }[];
    pageInfo?: { hasNextPage: boolean; endCursor?: string | null };
  };
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  compareAtPriceRange?: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  options: { id: string; name: string; values: string[] }[];
  seo: Seo;
  metafields?: Metafield[];
  onlineStoreUrl?: string | null;
  updatedAt?: string;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  image?: MediaImage | null;
  products: {
    edges: { node: Product; cursor: string }[];
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
  };
  metafields?: Metafield[];
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    image?: { url: string; altText?: string | null } | null;
    product: { handle: string; title: string };
    price: MoneyV2;
    compareAtPrice?: MoneyV2 | null;
    selectedOptions: SelectedOption[];
  };
  estimatedCost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
  };
  discountAllocations?: {
    discountedAmount: MoneyV2;
  }[];
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: { node: CartLine }[];
    pageInfo?: { hasNextPage: boolean; endCursor?: string | null };
  };
  cost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
    checkoutChargeAmount?: MoneyV2 | null;
    totalTaxAmount?: MoneyV2 | null;
  };
  discountCodes?: { code: string; applicable: boolean }[];
}

export interface MenuItem {
  id: string;
  title: string;
  type: string;
  url: string;
  items?: MenuItem[];
}

export interface Menu {
  items: MenuItem[];
}

export interface Page {
  id: string;
  handle: string;
  title: string;
  body: string;
  bodySummary?: string;
  url?: string;
  seo?: Seo;
  updatedAt?: string;
}

export interface Shop {
  id: string;
  name: string;
  description?: string | null;
  primaryDomain?: { url: string; host: string } | null;
  paymentSettings?: { currencyCode: string } | null;
  brand?: { logo?: { image?: MediaImage | null } | null } | null;
  metafields?: Metafield[];
}

export interface MetaobjectField {
  key: string;
  value: string;
  type?: string | null;
  reference?: { image?: MediaImage | null; product?: Product | null } | null;
}

export interface Metaobject {
  id: string;
  type: string;
  handle: string;
  fields: MetaobjectField[];
}

export interface MailingAddress {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  zone?: string | null;
  zip?: string | null;
  country?: string | null;
  phone?: string | null;
  formatted?: string[];
  isDefault?: boolean;
}

export interface Order {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus?: string | null;
  fulfillmentStatus?: string | null;
  totalPrice: MoneyV2;
  subtotalPrice?: MoneyV2 | null;
  customerUrl?: string | null;
  lineItems?: {
    edges: {
      node: {
        title: string;
        quantity: number;
        image?: { url: string; altText?: string | null } | null;
      };
    }[];
  };
}

export interface Customer {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  displayName?: string | null;
  orders?: { edges: { node: Order }[] } | Order[];
  defaultAddress?: MailingAddress | null;
  addresses?: { edges: { node: MailingAddress }[] } | MailingAddress[];
}

export interface ShopifyError {
  message: string;
  extensions?: { code?: string; path?: string[] } | null;
}
