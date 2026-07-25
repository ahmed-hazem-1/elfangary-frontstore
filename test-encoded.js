const fs = require('fs');

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-10';

const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    id handle title
  }
`;

const query = `query ProductByHandle($handle: String!) { product(handle: $handle) { ...ProductFields } } ${PRODUCT_FIELDS}`;
const encodedHandle = "%D8%B9%D8%B3%D9%84-%D9%86%D9%88%D8%A7%D8%B1%D8%A9-%D8%A7%D9%84%D8%A8%D8%B1%D8%B3%D9%8A%D9%85";

async function main() {
  const host = STORE_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const endpoint = "https://" + host + "/api/" + API_VERSION + "/graphql.json";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables: { handle: encodedHandle } }),
  });

  const json = await res.json();
  console.log("Encoded Handle result:", json.data.product ? "FOUND" : "NOT FOUND");
}

main().catch(console.error);
