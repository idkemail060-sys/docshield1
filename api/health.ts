export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    status: "online",
    platform: "vercel-serverless",
    hasGeminiKey: !!(process.env.GEMINI_API_KEY || "AQ.Ab8RN6KOOuSiwm5Dytku2VCongZ84E5ltgJ7NpdDd8MVTcaaxw"),
    timestamp: new Date().toISOString()
  });
}
