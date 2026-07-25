import { isCustomerApiConfigured, isShopifyConfigured } from "@/lib/shopify";

const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID?.trim();
const CLIENT_SECRET = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_SECRET?.trim();
const APP_URL = process.env.SHOPIFY_APP_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export function isAuthConfigured(): boolean {
  return isCustomerApiConfigured() && Boolean(CLIENT_SECRET);
}

function storeDomain(): string {
  return process.env.SHOPIFY_STORE_DOMAIN?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "") || "";
}

// Shopify OpenID Connect discovery: https://{shopDomain}/.well-known/openid-configuration
interface OpenIdConfig {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
}

const discoveryCache: { config: OpenIdConfig | null; ts: number } = { config: null, ts: 0 };
const DISCOVERY_TTL = 1000 * 60 * 10; // 10 minutes

async function getOpenIdConfig(): Promise<OpenIdConfig | null> {
  if (!storeDomain()) return null;
  const now = Date.now();
  if (discoveryCache.config && now - discoveryCache.ts < DISCOVERY_TTL) {
    return discoveryCache.config;
  }
  try {
    const res = await fetch(`https://${storeDomain()}/.well-known/openid-configuration`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[auth] openid discovery failed", res.status);
      return null;
    }
    const config = (await res.json()) as OpenIdConfig;
    discoveryCache.config = config;
    discoveryCache.ts = now;
    return config;
  } catch (err) {
    console.error("[auth] openid discovery error", err);
    return null;
  }
}

export async function buildAuthorizeUrl(locale: string): Promise<string | null> {
  if (!isAuthConfigured() || !CLIENT_ID) return null;
  const config = await getOpenIdConfig();
  if (!config?.authorization_endpoint) return null;
  const redirectUri = `${APP_URL}/${locale}/account/callback`;
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    scope: "openid email customer-account-api:full",
    redirect_uri: redirectUri,
    state: locale,
  });
  return `${config.authorization_endpoint}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string, locale: string): Promise<{
  access_token: string;
  refresh_token: string;
  id_token?: string;
  expires_in?: number;
} | null> {
  if (!isAuthConfigured() || !CLIENT_ID || !CLIENT_SECRET) return null;
  const config = await getOpenIdConfig();
  if (!config?.token_endpoint) return null;
  const redirectUri = `${APP_URL}/${locale}/account/callback`;
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  try {
    const res = await fetch(config.token_endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        code,
        redirect_uri: redirectUri,
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[auth] token exchange failed", res.status, body);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("[auth] token exchange error", err);
    return null;
  }
}

export { isShopifyConfigured };
