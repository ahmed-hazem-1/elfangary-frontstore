const fs = require('fs');

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-10';

const CART_FIELDS = `
  fragment CartFields on Cart {
    id checkoutUrl totalQuantity
    lines(first: 10) {
      edges {
        node {
          id quantity
          merchandise {
            ... on ProductVariant { id title price { amount currencyCode } }
          }
          estimatedCost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
        }
      }
    }
    cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
  }
`;

// Try to get a product variant ID first
const productQuery = `
{
  products(first: 1) {
    edges {
      node {
        variants(first: 1) { edges { node { id } } }
      }
    }
  }
}
`;

async function main() {
  const host = STORE_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const endpoint = "https://" + host + "/api/" + API_VERSION + "/graphql.json";

  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
  };

  const productRes = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: productQuery }),
  });
  const pData = await productRes.json();
  const variantId = pData.data.products.edges[0].node.variants.edges[0].node.id;

  const createQuery = `mutation { cartCreate(input: {lines: [{merchandiseId: "${variantId}", quantity: 2}]}) { cart { ...CartFields } } } ${CART_FIELDS}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: createQuery }),
  });

  const json = await res.json();
  console.log("Success! Cart Cost:", JSON.stringify(json.data.cartCreate.cart.cost, null, 2));
  console.log("Estimated Cost of Line 0:", JSON.stringify(json.data.cartCreate.cart.lines.edges[0].node.estimatedCost, null, 2));
}

main().catch(console.error);
