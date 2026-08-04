import type { AbandonedCartPayload, NotificationResult } from "./types";
import { buildAbandonedCartMessage } from "./messageBuilder";

export async function sendAbandonedCartNotification(
  payload: AbandonedCartPayload
): Promise<NotificationResult> {
  const isEnabled = process.env.ABANDONED_CART_ENABLED !== "false";
  const webhookUrl = process.env.ABANDONED_CART_WEBHOOK_URL?.trim();
  const whatsappApiUrl = process.env.WHATSAPP_API_URL?.trim();
  const whatsappApiToken = process.env.WHATSAPP_API_TOKEN?.trim();
  const isMock = process.env.ABANDONED_CART_MOCK === "true" || (!webhookUrl && !whatsappApiUrl);

  if (!isEnabled) {
    return {
      success: false,
      error: "Abandoned cart notifications are disabled via ABANDONED_CART_ENABLED=false",
    };
  }

  const formattedMessage = buildAbandonedCartMessage(payload);

  // 1. Mock / Development Mode
  if (isMock) {
    console.log("\n==========================================");
    console.log("🔔 [ABANDONED CART NOTIFICATION (MOCK MODE)]");
    console.log("Cart ID:", payload.cartId);
    console.log("Customer Phone:", payload.customer?.phone || "N/A");
    console.log("Checkout URL:", payload.checkoutUrl);
    console.log("Total Amount:", `${payload.totalAmount} ${payload.currencyCode}`);
    console.log("Items Count:", payload.totalQuantity);
    console.log("--- Formatted Message Preview ---");
    console.log(formattedMessage);
    console.log("==========================================\n");

    return {
      success: true,
      channel: "mock",
      messagePreview: formattedMessage,
      providerResponse: {
        status: "mock_logged",
        note: "Set ABANDONED_CART_WEBHOOK_URL or WHATSAPP_API_URL in .env to dispatch live requests.",
      },
    };
  }

  // 2. Custom Webhook / API Endpoint Dispatch (Channel-agnostic)
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          event: "abandoned_cart",
          timestamp: Date.now(),
          cartId: payload.cartId,
          checkoutUrl: payload.checkoutUrl,
          customer: payload.customer,
          items: payload.items,
          totalAmount: payload.totalAmount,
          currencyCode: payload.currencyCode,
          totalQuantity: payload.totalQuantity,
          message: formattedMessage,
        }),
      });

      const responseData = await response.json().catch(() => ({ status: response.status }));

      if (!response.ok) {
        console.error("❌ Abandoned Cart Webhook Dispatch Error:", response.status, responseData);
        return {
          success: false,
          channel: "webhook",
          error: `Webhook returned status ${response.status}`,
          providerResponse: responseData,
        };
      }

      return {
        success: true,
        channel: "webhook",
        providerResponse: responseData,
        messagePreview: formattedMessage,
      };
    } catch (err: any) {
      console.error("❌ Failed to dispatch to ABANDONED_CART_WEBHOOK_URL:", err);
      return {
        success: false,
        channel: "webhook",
        error: err.message || "Failed to reach webhook URL",
      };
    }
  }

  // 3. Dedicated WhatsApp Gateway API Dispatch (e.g. UltraMsg / Twilio / Custom WhatsApp Provider)
  if (whatsappApiUrl) {
    try {
      const recipientPhone = payload.customer?.phone?.replace(/\s+/g, "").replace(/^[+]/, "");
      if (!recipientPhone) {
        return {
          success: false,
          channel: "whatsapp",
          error: "Recipient phone number is required for WhatsApp dispatch",
        };
      }

      const bodyData: Record<string, any> = {
        to: recipientPhone,
        body: formattedMessage,
      };

      if (whatsappApiToken) {
        bodyData.token = whatsappApiToken;
      }

      const response = await fetch(whatsappApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(whatsappApiToken ? { Authorization: `Bearer ${whatsappApiToken}` } : {}),
        },
        body: JSON.stringify(bodyData),
      });

      const resJson = await response.json().catch(() => ({ status: response.status }));

      return {
        success: response.ok,
        channel: "whatsapp",
        providerResponse: resJson,
        messagePreview: formattedMessage,
      };
    } catch (err: any) {
      console.error("❌ Failed to dispatch to WHATSAPP_API_URL:", err);
      return {
        success: false,
        channel: "whatsapp",
        error: err.message || "WhatsApp dispatch failed",
      };
    }
  }

  return {
    success: false,
    error: "No active webhook or WhatsApp endpoint configured",
  };
}
