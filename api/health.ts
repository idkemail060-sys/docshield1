import { isQuotaCoolingDown, hasGeminiKey } from "../src/server/forensicService";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  res.status(200).json({
    status: "online",
    platform: "vercel-serverless",
    hasGeminiKey: hasGeminiKey(),
    quotaCoolingDown: isQuotaCoolingDown(),
    resilienceEngine: "Sovereign Cryptographic Core (Zero-Downtime)",
    timestamp: new Date().toISOString()
  });
}
