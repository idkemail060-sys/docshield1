import { analyzeDocumentPayload, getSovereignFallbackReport } from "../src/server/forensicService";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb"
    }
  },
  maxDuration: 30
};

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  let body: any = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch (parseErr) {
    body = req.body || {};
  }

  try {
    const result = await analyzeDocumentPayload(body);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Vercel Serverless Function encountered error, activating sovereign fallback:", err);
    const fallback = getSovereignFallbackReport(body);
    return res.status(200).json(fallback);
  }
}
