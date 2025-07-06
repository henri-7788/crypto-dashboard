import { NextRequest } from "next/server";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const apiKey = process.env.BINGX_API_KEY;
  const secretKey = process.env.BINGX_SECRET_KEY;
  if (!apiKey || !secretKey) {
    return new Response(JSON.stringify({ error: "API keys missing" }), { status: 500 });
  }

  const timestamp = Date.now();
  const queryString = `timestamp=${timestamp}`;
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(queryString)
    .digest("hex");

  const url = `https://open-api.bingx.com/api/v1/user/assets?${queryString}&signature=${signature}`;

  const res = await fetch(url, {
    headers: {
      "X-BX-APIKEY": apiKey,
    },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch BingX assets" }), { status: 500 });
  }

  const data = await res.json();
  // Summiere alle Asset-Werte in USDT (oder passe das Mapping an, falls nötig)
  let balance = 0;
  if (Array.isArray(data?.data)) {
    balance = data.data.reduce((sum: number, asset: any) => sum + (parseFloat(asset.usdtEquity || 0)), 0);
  }

  return new Response(JSON.stringify({ balance }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
} 