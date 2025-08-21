import { safeEqual, hmacHex } from "@/lib/crypto/hmac";

export async function verifyProviderWebhook(req: Request, secret: string, sigHeader = "x-signature", tsHeader = "x-timestamp") {
  const sig = req.headers.get(sigHeader) || "";
  const ts = req.headers.get(tsHeader) || "";
  const raw = await req.clone().text();
  const payload = `${ts}.${raw}`;
  const expected = hmacHex(payload, secret);
  return safeEqual(expected, sig);
}

export function ack() {
  return Response.json({ ok: true });
}