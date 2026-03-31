import crypto from "crypto";

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const FB_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const API_VERSION = "v19.0";

type MetaEvent = {
  event_name: string;
  event_time: number;
  action_source: "website" | "app" | "physical_store" | "system_generated" | "other";
  event_source_url?: string;
  user_data: {
    em?: string | string[]; // hashed email
    ph?: string | string[]; // hashed phone number
    fn?: string | string[]; // hashed first name
    ln?: string | string[]; // hashed last name
    client_ip_address?: string;
    client_user_agent?: string;
    fbp?: string;
    fbc?: string;
    [key: string]: any;
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    [key: string]: any;
  };
};

/**
 * Normaliza e faz o hash SHA256 de um campo de dado do usuário antes de enviar.
 */
function hashData(data: string | undefined): string | undefined {
  if (!data) return undefined;
  const normalized = data.trim().toLowerCase();
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Envia um evento diretamente para a API de Conversões do Meta.
 */
export async function sendServerEvent(event: Partial<MetaEvent>) {
  if (!FB_PIXEL_ID || !FB_ACCESS_TOKEN) {
    console.warn("⚠️ Meta CAPI: PIXEL_ID ou ACCESS_TOKEN não configurado.");
    return false;
  }

  // Prepara fbp e fbc a partir dos cookies (opcional mas recomendado)
  // Em Next.js você pode passar isso do NextRequest/cookies se tiver disponível
  
  const payload: MetaEvent = {
    event_name: event.event_name || "CustomEvent",
    event_time: Math.floor(Date.now() / 1000), // Time in seconds
    action_source: event.action_source || "website",
    event_source_url: event.event_source_url,
    user_data: {
      ...event.user_data,
      em: hashData(event.user_data?.em as string),
      ph: hashData(event.user_data?.ph as string),
    },
    custom_data: event.custom_data,
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [payload],
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Falha ao enviar evento CAPI:", result);
      return false;
    }

    console.log(`✅ Evento CAPI [${payload.event_name}] enviado com sucesso.`);
    return true;
  } catch (error) {
    console.error("❌ Erro ao chamar Meta Conversions API:", error);
    return false;
  }
}
