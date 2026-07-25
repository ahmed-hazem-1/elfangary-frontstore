const fs = require('fs');

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || '2024-10';

const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    id handle title description descriptionHtml vendor productType tags
    availableForSale
    featuredImage { url altText width height }
    options { id name values }
    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
    variants(first: 100) {
      edges {
        node {
          id title availableForSale sku
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          image { url altText }
          selectedOptions { name value }
          unitPrice { amount currencyCode }
        }
      }
    }
    images(first: 10) { edges { node { url altText width height } } }
    seo { title description }
    metafields(identifiers: [
      { namespace: "custom", key: "nutrition" }
      { namespace: "custom", key: "origin" }
      { namespace: "custom", key: "season" }
      { namespace: "custom", key: "certifications" }
    ]) { key namespace value type }
    updatedAt
  }
`;

const query = `query ProductByHandle($handle: String!) { product(handle: $handle) { ...ProductFields } } ${PRODUCT_FIELDS}`;
const handleToTest = "عسل-نوارة-البرسيم";

async function main() {
  const host = STORE_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const endpoint = "https://" + host + "/api/" + API_VERSION + "/graphql.json";

  console.log("Endpoint:", endpoint);
  console.log("Testing handle:", handleToTest);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables: { handle: handleToTest } }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error("Errors:", JSON.stringify(json.errors, null, 2));
  } else {
    console.log("Success! Product:", json.data.product ? json.data.product.title : "NULL - Product not found");
  }
}

main().catch(console.error);
