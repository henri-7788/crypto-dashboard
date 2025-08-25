"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type StatCardProps = {
  title: string;
  value: string | number;
  hint?: string;
};

function StatCard({ title, value, hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-4 bg-background">
      <div className="text-xs opacity-70">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint ? <div className="text-xs mt-1 opacity-60">{hint}</div> : null}
    </div>
  );
}

type Trade = {
  id: string;
  date: string; // ISO
  asset: string;
  side: "LONG" | "SHORT";
  qty: number;
  entry: number;
  exit?: number;
  fees?: number;
  notes?: string;
};

function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState] as const;
}

const DUMMY_TRADES: Trade[] = [
  {
    id: "t1",
    date: new Date().toISOString(),
    asset: "BTCUSDT",
    side: "LONG",
    qty: 0.01,
    entry: 60000,
    exit: 60500,
    fees: 1.2,
    notes: "Scalp breakouts",
  },
  {
    id: "t2",
    date: new Date(Date.now() - 86400000).toISOString(),
    asset: "ETHUSDT",
    side: "SHORT",
    qty: 0.1,
    entry: 3000,
    exit: 2950,
    fees: 0.8,
    notes: "Trend pullback",
  },
];

type TradingJournalProps = {
  trades: Trade[];
  setTrades: React.Dispatch<React.SetStateAction<Trade[]>>;
  filter: TradeFilter;
};

function TradingJournal({ trades, setTrades, filter }: TradingJournalProps) {
  const [form, setForm] = useState<Partial<Trade>>({ side: "LONG" });
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredTrades = useMemo(() => applyFilter(trades, filter), [trades, filter]);

  function resetForm() {
    setForm({ side: "LONG" });
    setEditingId(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.asset || !form.entry || !form.qty) return;
    const base: Trade = {
      id: editingId ?? crypto.randomUUID(),
      date: form.date || new Date().toISOString(),
      asset: form.asset,
      side: (form.side as Trade["side"]) || "LONG",
      qty: Number(form.qty),
      entry: Number(form.entry),
      exit: form.exit != null && form.exit !== undefined && form.exit !== ("" as unknown as number) ? Number(form.exit) : undefined,
      fees: form.fees != null && form.fees !== undefined && form.fees !== ("" as unknown as number) ? Number(form.fees) : undefined,
      notes: form.notes || "",
    };
    setTrades((prev) => {
      const without = prev.filter((t) => t.id !== base.id);
      return [base, ...without];
    });
    resetForm();
  }

  function editTrade(t: Trade) {
    setEditingId(t.id);
    setForm(t);
  }

  function deleteTrade(id: string) {
    setTrades((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <section id="journal" className="mt-8">
      <div className="flex items-end justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold">Trading Journal</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
        <input className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 text-sm" placeholder="Asset (e.g. BTCUSDT)" value={form.asset || ""} onChange={(e) => setForm((f) => ({ ...f, asset: e.target.value.toUpperCase() }))} />
        <select className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 text-sm" value={form.side as string} onChange={(e) => setForm((f) => ({ ...f, side: e.target.value as Trade["side"] }))}>
          <option>LONG</option>
          <option>SHORT</option>
        </select>
        <input className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 text-sm" type="number" step="any" placeholder="Qty" value={form.qty ?? ""} onChange={(e) => setForm((f) => ({ ...f, qty: Number(e.target.value) }))} />
        <input className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 text-sm" type="number" step="any" placeholder="Entry" value={form.entry ?? ""} onChange={(e) => setForm((f) => ({ ...f, entry: Number(e.target.value) }))} />
        <input className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 text-sm" type="number" step="any" placeholder="Exit (optional)" value={form.exit ?? ""} onChange={(e) => setForm((f) => ({ ...f, exit: e.target.value === "" ? undefined : Number(e.target.value) }))} />
        <input className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 text-sm" type="number" step="any" placeholder="Fees (optional)" value={form.fees ?? ""} onChange={(e) => setForm((f) => ({ ...f, fees: e.target.value === "" ? undefined : Number(e.target.value) }))} />
        <input className="col-span-2 md:col-span-3 lg:col-span-2 h-9 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 text-sm" placeholder="Notes" value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
        <button type="submit" className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] text-sm px-3 hover:bg-black/5 dark:hover:bg-white/10">
          {editingId ? "Update" : "Add"}
        </button>
        {editingId ? (
          <button type="button" onClick={resetForm} className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] text-sm px-3 hover:bg-black/5 dark:hover:bg-white/10">
            Cancel
          </button>
        ) : null}
      </form>

      <div className="overflow-auto rounded-lg border border-black/[.08] dark:border-white/[.145]">
        <table className="w-full text-sm">
          <thead className="bg-black/[.03] dark:bg-white/[.06] text-left">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Asset</th>
              <th className="px-3 py-2">Side</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Entry</th>
              <th className="px-3 py-2">Exit</th>
              <th className="px-3 py-2">Fees</th>
              <th className="px-3 py-2">Notes</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map((t) => (
              <tr key={t.id} className="border-t border-black/[.06] dark:border-white/[.09]">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(t.date).toLocaleString()}</td>
                <td className="px-3 py-2">{t.asset}</td>
                <td className="px-3 py-2">
                  <span className={"px-2 py-0.5 rounded text-xs " + (t.side === "LONG" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-400")}>{t.side}</span>
                </td>
                <td className="px-3 py-2">{t.qty}</td>
                <td className="px-3 py-2">{t.entry}</td>
                <td className="px-3 py-2">{t.exit ?? "—"}</td>
                <td className="px-3 py-2">{t.fees ?? "—"}</td>
                <td className="px-3 py-2 max-w-[240px] truncate" title={t.notes}>{t.notes}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button className="rounded border border-black/[.08] dark:border-white/[.145] px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10" onClick={() => editTrade(t)}>Edit</button>
                    <button className="rounded border border-black/[.08] dark:border-white/[.145] px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10" onClick={() => deleteTrade(t.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type TradeFilter = {
  query?: string;
  side?: "LONG" | "SHORT" | "ALL";
  from?: string; // ISO date string (yyyy-mm-dd)
  to?: string; // ISO date string
};

function applyFilter(trades: Trade[], filter: TradeFilter): Trade[] {
  return trades.filter((t) => {
    if (filter.side && filter.side !== "ALL" && t.side !== filter.side) return false;
    if (filter.query) {
      const q = filter.query.toLowerCase();
      if (!(`${t.asset}`.toLowerCase().includes(q) || `${t.notes ?? ""}`.toLowerCase().includes(q))) return false;
    }
    const time = new Date(t.date).getTime();
    if (filter.from) {
      const fromTs = new Date(filter.from).getTime();
      if (time < fromTs) return false;
    }
    if (filter.to) {
      const toTs = new Date(filter.to).getTime() + 24 * 60 * 60 * 1000 - 1;
      if (time > toTs) return false;
    }
    return true;
  });
}

function computeKpis(trades: Trade[]) {
  const closed = trades.filter((t) => t.exit != null);
  const wins = closed.filter((t) => ((t.exit ?? 0) - t.entry) * (t.side === "LONG" ? 1 : -1) > 0).length;
  const losses = closed.length - wins;
  const winrate = closed.length ? Math.round((wins / closed.length) * 100) : 0;
  const grossProfit = closed
    .map((t) => (((t.exit ?? 0) - t.entry) * (t.side === "LONG" ? 1 : -1)) * t.qty - (t.fees ?? 0))
    .filter((p) => p > 0)
    .reduce((a, b) => a + b, 0);
  const grossLoss = closed
    .map((t) => (((t.exit ?? 0) - t.entry) * (t.side === "LONG" ? 1 : -1)) * t.qty - (t.fees ?? 0))
    .filter((p) => p < 0)
    .reduce((a, b) => a + b, 0);
  const profitFactor = Math.abs(grossLoss) > 0 ? (grossProfit / Math.abs(grossLoss)) : (grossProfit > 0 ? Infinity : 0);
  // Simple equity curve and drawdown
  const sorted = [...closed].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  const equityPoints = sorted.map((t) => {
    const pnl = (((t.exit ?? 0) - t.entry) * (t.side === "LONG" ? 1 : -1)) * t.qty - (t.fees ?? 0);
    equity += pnl;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.min(maxDrawdown, equity - peak);
    return { date: new Date(t.date).toLocaleDateString(), equity: Number(equity.toFixed(2)) };
  });
  const drawdown = maxDrawdown;
  return { winrate, profitFactor, drawdown, equityPoints };
}

function weekdayPerformance(trades: Trade[]) {
  const closed = trades.filter((t) => t.exit != null);
  const map: Record<number, { count: number; pnl: number }> = { 0: { count: 0, pnl: 0 }, 1: { count: 0, pnl: 0 }, 2: { count: 0, pnl: 0 }, 3: { count: 0, pnl: 0 }, 4: { count: 0, pnl: 0 }, 5: { count: 0, pnl: 0 }, 6: { count: 0, pnl: 0 } };
  for (const t of closed) {
    const d = new Date(t.date).getDay();
    const pnl = (((t.exit ?? 0) - t.entry) * (t.side === "LONG" ? 1 : -1)) * t.qty - (t.fees ?? 0);
    map[d].count += 1;
    map[d].pnl += pnl;
  }
  return [0, 1, 2, 3, 4, 5, 6].map((d) => ({ weekday: d, count: map[d].count, pnl: Number(map[d].pnl.toFixed(2)) }));
}

function strategyDistribution(trades: Trade[]) {
  // If notes include tags like "scalp", "trend", etc., use them; fallback to side
  const buckets: Record<string, number> = {};
  for (const t of trades) {
    const key = (t.notes?.match(/(scalp|trend|breakout|mean\s*reversion|news)/i)?.[1]?.toLowerCase() || t.side).toUpperCase();
    buckets[key] = (buckets[key] ?? 0) + 1;
  }
  return Object.entries(buckets).map(([name, value]) => ({ name, value }));
}

const PIE_COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#c084fc", "#f472b6"]; 

export default function Home() {
  const [trades, setTrades] = useLocalStorage<Trade[]>("trades", DUMMY_TRADES);
  const [filter, setFilter] = useState<TradeFilter>({ side: "ALL" });

  const totalTrades = trades.length;
  const kpis = useMemo(() => computeKpis(applyFilter(trades, filter)), [trades, filter]);
  const weekday = useMemo(() => weekdayPerformance(applyFilter(trades, filter)), [trades, filter]);
  const pieData = useMemo(() => strategyDistribution(applyFilter(trades, filter)), [trades, filter]);

  return (
    <div className="space-y-6">
      <section id="overview">
        <h2 className="text-lg font-semibold mb-3">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard title="Total Trades" value={totalTrades} />
          <StatCard title="Winrate" value={`${kpis.winrate}%`} />
          <StatCard title="Profit Factor" value={Number.isFinite(kpis.profitFactor) ? kpis.profitFactor.toFixed(2) : "∞"} />
          <StatCard title="Max Drawdown" value={kpis.drawdown.toFixed(2)} />
        </div>
      </section>

      <section id="filters" className="space-y-3">
        <h3 className="font-semibold">Filters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <input className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 text-sm" placeholder="Search asset/notes" value={filter.query ?? ""} onChange={(e) => setFilter((f) => ({ ...f, query: e.target.value }))} />
          <select className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 text-sm" value={filter.side ?? "ALL"} onChange={(e) => setFilter((f) => ({ ...f, side: e.target.value as TradeFilter["side"] }))}>
            <option value="ALL">All</option>
            <option value="LONG">LONG</option>
            <option value="SHORT">SHORT</option>
          </select>
          <input type="date" className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 text-sm" value={filter.from ?? ""} onChange={(e) => setFilter((f) => ({ ...f, from: e.target.value }))} />
          <input type="date" className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] bg-transparent px-3 text-sm" value={filter.to ?? ""} onChange={(e) => setFilter((f) => ({ ...f, to: e.target.value }))} />
          <button className="h-9 rounded-md border border-black/[.08] dark:border-white/[.145] text-sm px-3 hover:bg-black/5 dark:hover:bg-white/10" onClick={() => setFilter({ side: "ALL" })}>Reset</button>
        </div>
      </section>

      <section id="analytics" className="space-y-4">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-1 lg:col-span-2 rounded-xl border border-black/[.08] dark:border-white/[.145] p-3">
            <div className="text-sm opacity-70 mb-2">Equity Curve</div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpis.equityPoints} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <XAxis dataKey="date" hide={false} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="equity" stroke="#60a5fa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-3">
            <div className="text-sm opacity-70 mb-2">Strategy Distribution</div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-3">
          <div className="text-sm opacity-70 mb-2">Weekday Performance (PnL)</div>
          <div className="grid grid-cols-7 gap-2">
            {weekday.map((d) => {
              const v = d.pnl;
              const color = v > 0 ? "bg-green-500/20" : v < 0 ? "bg-red-500/20" : "bg-black/10 dark:bg-white/10";
              const label = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.weekday];
              return (
                <div key={d.weekday} className={`rounded-md p-3 text-center ${color}`}>
                  <div className="text-xs opacity-70">{label}</div>
                  <div className="font-semibold text-sm">{v.toFixed(2)}</div>
                  <div className="text-[10px] opacity-60">{d.count} trades</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="market" className="space-y-4">
        <h2 className="text-lg font-semibold">Market Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <FearGreedWidget />
          <LiveTickers symbols={["btcusdt", "ethusdt", "solusdt"]} />
          <NewsFeed />
        </div>
        <EconomicCalendar />
      </section>

      <TradingJournal trades={trades} setTrades={setTrades} filter={filter} />
    </div>
  );
}

function FearGreedWidget() {
  const [data, setData] = useState<{ value: string; value_classification: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("https://api.alternative.me/fng/?limit=1")
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        const d = j?.data?.[0];
        if (d) setData({ value: d.value, value_classification: d.value_classification });
      })
      .catch((e) => setError(String(e)));
    return () => {
      alive = false;
    };
  }, []);
  return (
    <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-3">
      <div className="text-sm opacity-70 mb-2">Fear & Greed Index</div>
      {data ? (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-semibold">{data.value}</div>
            <div className="text-sm opacity-70">{data.value_classification}</div>
          </div>
          <div className="size-16 rounded-full border-4 border-black/[.12] dark:border-white/[.18] flex items-center justify-center text-lg">
            {data.value}
          </div>
        </div>
      ) : error ? (
        <div className="text-sm opacity-70">Failed to load</div>
      ) : (
        <div className="text-sm opacity-70">Loading…</div>
      )}
    </div>
  );
}

type Ticker = { s: string; c: string };
function LiveTickers({ symbols }: { symbols: string[] }) {
  const [prices, setPrices] = useState<Record<string, string>>({});
  useEffect(() => {
    const streams = symbols.map((s) => `${s}@ticker`).join("/");
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        const payload: Ticker = msg?.data;
        if (payload?.s && payload?.c) {
          setPrices((p) => ({ ...p, [payload.s]: payload.c }));
        }
      } catch {}
    };
    return () => {
      try { ws.close(); } catch {}
    };
  }, [symbols]);

  return (
    <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-3">
      <div className="text-sm opacity-70 mb-2">Live Prices (Binance)</div>
      <div className="grid grid-cols-3 gap-2">
        {symbols.map((s) => {
          const key = s.toUpperCase();
          const price = prices[key] ?? "—";
          return (
            <div key={s} className="rounded-md border border-black/[.08] dark:border-white/[.145] p-2 text-center">
              <div className="text-xs opacity-70">{key}</div>
              <div className="font-semibold">{price}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EconomicCalendar() {
  const [items, setItems] = useState<Array<{ Country?: string; Category?: string; Event?: string; Date?: string; Importance?: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    const url = "https://api.tradingeconomics.com/calendar?c=guest:guest&format=json";
    fetch(url)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        const upcoming = Array.isArray(j) ? j : [];
        const simplified = upcoming
          .filter((x) => x?.Date && x?.Event)
          .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())
          .slice(0, 10);
        setItems(simplified);
      })
      .catch((e) => setError(String(e)));
    return () => { alive = false; };
  }, []);
  return (
    <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-3">
      <div className="text-sm opacity-70 mb-2">Economic Calendar</div>
      {error ? (
        <div className="text-sm opacity-70">Failed to load</div>
      ) : items.length === 0 ? (
        <div className="text-sm opacity-70">Loading…</div>
      ) : (
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="flex gap-2 text-sm">
              <div className="w-[120px] opacity-70">{it.Date ? new Date(it.Date).toLocaleString() : ""}</div>
              <div className="flex-1 truncate" title={it.Event}>{it.Event}</div>
              <div className="w-[80px] text-right opacity-70">{it.Country}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewsFeed() {
  const token = (typeof process !== "undefined" ? (process as any).env?.NEXT_PUBLIC_CRYPTOPANIC_TOKEN : undefined) as string | undefined;
  const [items, setItems] = useState<Array<{ title: string; url: string; domain?: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    if (!token) {
      setError("Set NEXT_PUBLIC_CRYPTOPANIC_TOKEN to enable news feed");
      return () => { alive = false; };
    }
    fetch(`https://cryptopanic.com/api/v1/posts/?auth_token=${token}&public=true`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        const posts = j?.results ?? [];
        setItems(posts.map((p: any) => ({ title: p.title, url: p.url, domain: p.domain })));
      })
      .catch((e) => setError(String(e)));
    return () => { alive = false; };
  }, [token]);
  return (
    <div className="rounded-xl border border-black/[.08] dark:border-white/[.145] p-3">
      <div className="text-sm opacity-70 mb-2">Live News</div>
      {error ? (
        <div className="text-sm opacity-70">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-sm opacity-70">Loading…</div>
      ) : (
        <div className="space-y-2">
          {items.slice(0, 6).map((n, idx) => (
            <a key={idx} href={n.url} target="_blank" rel="noreferrer" className="block text-sm hover:underline truncate">
              {n.title} <span className="opacity-60">{n.domain ? `(${n.domain})` : ""}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
