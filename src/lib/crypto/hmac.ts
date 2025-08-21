import crypto from "crypto";

export function canonicalString(method: string, path: string, timestamp: string | number, bodyRaw = "") {
  return `${method.toUpperCase()}|${path}|${timestamp}|${bodyRaw}`;
}

export function hmacHex(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function signRequest(method: string, path: string, body?: any, secret = process.env.HMAC_SHARED_SECRET || "") {
  const ts = Date.now().toString();
  const raw = body ? JSON.stringify(body) : "";
  const payload = canonicalString(method, path, ts, raw);
  const sig = hmacHex(payload, secret);
  return { ts, sig, raw };
}

export function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}