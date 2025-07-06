import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key missing" }), { status: 500 });
  }

  // CMC Crypto Market Index (z.B. CMC200)
  const cmcIndexUrl = "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest";
  // Fear and Greed Index (CoinMarketCap Alternative: https://api.alternative.me/fng/)
  const fngUrl = "https://api.alternative.me/fng/";

  try {
    // CMC Index
    const cmcRes = await fetch(cmcIndexUrl, {
      headers: { "X-CMC_PRO_API_KEY": apiKey },
      next: { revalidate: 60 },
    });
    const cmcData = await cmcRes.json();
    const cmcIndex = cmcData.data?.btc_dominance || null;

    // Fear and Greed Index
    const fngRes = await fetch(fngUrl, { next: { revalidate: 60 } });
    const fngData = await fngRes.json();
    const fngIndex = fngData.data?.[0] || null;

    return new Response(
      JSON.stringify({
        cmcIndex,
        fngIndex,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: "Failed to fetch index data" }), { status: 500 });
  }
} 