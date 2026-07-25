const fs = require('fs');

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-10';

const CART_FIELDS = `
  fragment CartFields on Cart {
    id checkoutUrl totalQuantity
    discountCodes { code applicable }
    cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
  }
`;

const query = `mutation CartCreate { cartCreate { cart { ...CartFields } } } ${CART_FIELDS}`;

async function main() {
  const host = STORE_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const endpoint = "https://" + host + "/api/" + API_VERSION + "/graphql.json";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error("Errors:", JSON.stringify(json.errors, null, 2));
  } else {
    console.log("Success! Cart:", JSON.stringify(json.data.cartCreate.cart, null, 2));
  }
}

main().catch(console.error);
