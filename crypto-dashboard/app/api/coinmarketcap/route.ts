import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key missing" }), { status: 500 });
  }

  const url =
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10&convert=USD";

  const res = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
    },
    next: { revalidate: 60 }, // Caching für 60 Sekunden
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
  }

  const data = await res.json();
  // Filtere nur die wichtigsten Coins
  const wanted = ["BTC", "ETH", "USDT", "SOL"];
  const coins = data.data
    .filter((coin: any) => wanted.includes(coin.symbol))
    .map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.quote.USD.price,
      percent_change_24h: coin.quote.USD.percent_change_24h,
      market_cap: coin.quote.USD.market_cap,
    }));

  return new Response(JSON.stringify({ coins }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
} 