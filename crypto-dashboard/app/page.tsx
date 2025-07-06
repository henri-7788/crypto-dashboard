'use client';
import React, { useEffect, useState } from "react";
import { FaRegBell, FaRegUserCircle, FaSearch, FaBitcoin, FaEthereum, FaChartLine, FaArrowUp, FaArrowDown } from "react-icons/fa";
// Remove react-icons/fa import due to missing module

export default function Home() {
  // Platzhalter für dynamische Coin-Daten
  const [coins, setCoins] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState({
    total: 0,
    btc: 0,
    eth: 0,
    usdt: 0,
    change: 0,
  });
  const [cmcIndex, setCmcIndex] = useState<number | null>(null);
  const [fngIndex, setFngIndex] = useState<any>(null);
  const [bingxBalance, setBingxBalance] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let stopped = false;

    const fetchCoins = async () => {
      try {
        const res = await fetch("/api/coinmarketcap");
        const data = await res.json();
        setCoins(data.coins);
        // Beispiel: Portfolio aus Coin-Daten berechnen (hier Dummy-Werte)
        setPortfolio({
          total: data.coins.reduce((sum: number, c: any) => sum + c.price, 0),
          btc: data.coins.find((c: any) => c.symbol === "BTC")?.price || 0,
          eth: data.coins.find((c: any) => c.symbol === "ETH")?.price || 0,
          usdt: data.coins.find((c: any) => c.symbol === "USDT")?.price || 0,
          change: data.coins[0]?.percent_change_24h?.toFixed(2) || 0,
        });
      } catch (e) {
        // Fehlerbehandlung
      }
    };

    const startInterval = () => {
      fetchCoins();
      interval = setInterval(() => {
        if (document.visibilityState === "visible") {
          fetchCoins();
        }
      }, 60000);
    };

    startInterval();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && !stopped) {
        fetchCoins();
      }
    });

    // Fetch CMC Index & Fear and Greed Index
    const fetchIndexes = async () => {
      try {
        const res = await fetch("/api/cmc-index");
        const data = await res.json();
        setCmcIndex(data.cmcIndex);
        setFngIndex(data.fngIndex);
      } catch (e) {}
    };
    fetchIndexes();
    const idxInterval = setInterval(fetchIndexes, 60000);

    // BingX Kontostand abrufen
    const fetchBingx = async () => {
      try {
        const res = await fetch("/api/bingx-balance");
        const data = await res.json();
        setBingxBalance(data.balance);
      } catch (e) {}
    };
    fetchBingx();
    const bingxInterval = setInterval(fetchBingx, 60000);

    return () => {
      stopped = true;
      if (interval) clearInterval(interval);
      clearInterval(idxInterval);
      clearInterval(bingxInterval);
    };
  }, []);

  // Hilfsfunktion für Tacho-Design
  function Gauge({ value, min, max, label, color, sublabel, gradient, valueUnit, icon }: { value: number, min: number, max: number, label: string, color: string, sublabel?: string, gradient?: string, valueUnit?: string, icon?: React.ReactNode }) {
    const percent = Math.max(0, Math.min(1, (value - min) / (max - min)));
    const angle = percent * 180 - 90;
    const displayValue = value % 1 === 0 ? value : value.toFixed(1);
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-xs bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 mx-auto" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
        <div className="relative w-full flex items-center justify-center" style={{ minHeight: 120 }}>
          <svg width="180" height="100" viewBox="0 0 180 100" className="block">
            <defs>
              <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                {gradient ? (
                  <>
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </>
                ) : (
                  <stop offset="0%" stopColor={color} />
                )}
              </linearGradient>
            </defs>
            {/* Hintergrundbogen */}
            <path d="M20,90 A70,70 0 0,1 160,90" fill="none" stroke="#e5e7eb" strokeWidth="16" />
            {/* Farbverlauf-Bogen */}
            <path d="M20,90 A70,70 0 0,1 160,90" fill="none" stroke="url(#gauge-gradient)" strokeWidth="16" strokeDasharray={`${percent * 220} 220`} strokeLinecap="round" />
          </svg>
        </div>
        {/* Wert unter dem Bogen */}
        <div className="flex flex-col items-center mt-2 mb-2">
          <span className="flex items-end text-4xl font-extrabold tracking-tight" style={{ color: gradient ? (percent < 0.4 ? '#ef4444' : percent > 0.6 ? '#22c55e' : '#facc15') : color, textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            {icon && <span className="mr-2 text-2xl">{icon}</span>}
            {displayValue}
            {valueUnit && <span className="text-2xl font-bold ml-1 mb-0.5">{valueUnit}</span>}
          </span>
        </div>
        <div className="mt-2 text-lg font-bold text-gray-700 text-center">{label}</div>
        {sublabel && <div className="text-sm text-gray-400 text-center mt-1">{sublabel}</div>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] flex">
      {/* Sidebar */}
      <aside className="w-20 bg-white shadow-lg flex flex-col items-center py-8 rounded-3xl m-4">
        <div className="mb-8">
          <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            ₿
          </div>
        </div>
        <nav className="flex flex-col gap-8 text-gray-400 text-2xl">
          <button className="hover:text-indigo-500 transition-colors"><FaChartLine /></button>
          <button className="hover:text-indigo-500 transition-colors"><FaBitcoin /></button>
          <button className="hover:text-indigo-500 transition-colors"><FaEthereum /></button>
          <button className="hover:text-indigo-500 transition-colors">⚙️</button>
        </nav>
        <div className="mt-auto">
          <button className="text-gray-300 hover:text-indigo-500 text-2xl">⏻</button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Krypto Dashboard</h1>
            <p className="text-gray-400 text-sm">Dein Portfolio & Marktüberblick</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Suche Coins, Wallets..."
                className="pl-10 pr-4 py-2 rounded-full bg-white shadow text-sm focus:outline-none"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <button className="bg-white p-2 rounded-full shadow text-gray-400 hover:text-indigo-500">
              <FaRegBell size={20} />
            </button>
            <button className="bg-white p-2 rounded-full shadow text-gray-400 hover:text-indigo-500">
              <FaRegUserCircle size={20} />
            </button>
          </div>
        </header>
        {/* Portfolio Grid */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Portfolio</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
              <span className="text-xs text-gray-400 mb-2">Gesamtwert</span>
              <span className="text-2xl font-bold text-gray-700">{bingxBalance !== null ? `$${bingxBalance.toLocaleString()}` : "Lädt..."}</span>
              <span className="text-xs text-green-500 mt-2 flex items-center"><FaArrowUp className="mr-1" /> {portfolio.change}% heute</span>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
              <span className="text-xs text-gray-400 mb-2">Bitcoin (BTC)</span>
              <span className="text-2xl font-bold text-gray-700">{portfolio.btc} BTC</span>
              <span className="text-xs text-green-500 mt-2 flex items-center"><FaArrowUp className="mr-1" /> 2.1%</span>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
              <span className="text-xs text-gray-400 mb-2">Ethereum (ETH)</span>
              <span className="text-2xl font-bold text-gray-700">{portfolio.eth} ETH</span>
              <span className="text-xs text-red-500 mt-2 flex items-center"><FaArrowDown className="mr-1" /> 1.4%</span>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
              <span className="text-xs text-gray-400 mb-2">USDT</span>
              <span className="text-2xl font-bold text-gray-700">${portfolio.usdt.toLocaleString()}</span>
              <span className="text-xs text-gray-400 mt-2">Stablecoin</span>
            </div>
          </div>
        </section>
        {/* Marktübersicht & Chart Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Coins */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Dynamische Coin-Infos */}
            {coins.slice(0, 3).map((coin, idx) => (
              <div key={coin.id} className={`rounded-2xl shadow p-6 flex flex-col items-start ${idx === 0 ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' : 'bg-white'}`}>
                <span className="text-lg font-semibold mb-2">{coin.name}</span>
                <span className="text-3xl font-bold mb-1">{coin.symbol}</span>
                <span className="text-xs mb-2">${coin.price?.toLocaleString()}</span>
                <div className="w-full flex flex-col items-center mt-2">
                  <div className="w-24 h-8 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold">{coin.percent_change_24h}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6 flex flex-col justify-between min-h-[220px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">Portfolio Entwicklung</span>
              <button className="text-xs text-indigo-500 hover:underline">Chart Details</button>
            </div>
            {/* Platzhalter für Chart */}
            <div className="flex-1 flex items-end gap-4 h-32">
              {/* Dummy Bars */}
              {[60, 80, 50, 90, 70, 60, 80, 50].map((h, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-6 rounded-t-lg bg-indigo-400" style={{ height: `${h}%`, minHeight: '20px' }}></div>
                  <span className="text-xs text-gray-400 mt-1">{['Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Index-Anzeigen */}
        <section className="flex flex-col md:flex-row gap-8 mb-8 items-center justify-center">
          <Gauge
            value={cmcIndex ?? 0}
            min={30}
            max={70}
            label="BTC Dominance (%)"
            color="#6366f1"
            sublabel="CMC Index"
            valueUnit="%"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="2" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#6366f1" fontWeight="bold">Q</text></svg>}
          />
          {fngIndex && (
            <Gauge
              value={parseInt(fngIndex.value)}
              min={0}
              max={100}
              label={`Fear & Greed: ${fngIndex.value_classification}`}
              color="#22c55e"
              gradient="true"
              sublabel={fngIndex.value}
            />
          )}
        </section>
        {/* Transaktionen */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Letzte Transaktionen</h2>
          {/* Platzhalter für dynamische Transaktionen */}
          <div className="text-gray-400">(Transaktionen werden nach API-Integration angezeigt)</div>
        </section>
      </main>
    </div>
  );
}
