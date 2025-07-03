import React from "react";
import { FaRegBell, FaRegUserCircle, FaSearch, FaBitcoin, FaEthereum, FaChartLine, FaArrowUp, FaArrowDown } from "react-icons/fa";
// Remove react-icons/fa import due to missing module

export default function Home() {
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
              <span className="text-2xl font-bold text-gray-700">$42,500.00</span>
              <span className="text-xs text-green-500 mt-2 flex items-center"><FaArrowUp className="mr-1" /> 3.2% heute</span>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
              <span className="text-xs text-gray-400 mb-2">Bitcoin (BTC)</span>
              <span className="text-2xl font-bold text-gray-700">1.25 BTC</span>
              <span className="text-xs text-green-500 mt-2 flex items-center"><FaArrowUp className="mr-1" /> 2.1%</span>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
              <span className="text-xs text-gray-400 mb-2">Ethereum (ETH)</span>
              <span className="text-2xl font-bold text-gray-700">10.5 ETH</span>
              <span className="text-xs text-red-500 mt-2 flex items-center"><FaArrowDown className="mr-1" /> 1.4%</span>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
              <span className="text-xs text-gray-400 mb-2">USDT</span>
              <span className="text-2xl font-bold text-gray-700">$5,000.00</span>
              <span className="text-xs text-gray-400 mt-2">Stablecoin</span>
            </div>
          </div>
        </section>
        {/* Marktübersicht & Chart Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Coins */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow p-6 text-white flex flex-col items-center justify-center min-h-[180px]">
              <span className="text-lg font-semibold mb-2">Top Coin</span>
              <span className="text-3xl font-bold mb-1">Bitcoin</span>
              <span className="text-xs mb-2">$34,000.00</span>
              <div className="w-full flex flex-col items-center mt-2">
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-2xl font-bold">+4.5%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
              <span className="text-xs text-gray-400 mb-2">Ethereum</span>
              <span className="text-2xl font-bold text-gray-700">$2,100.00</span>
              <span className="text-xs text-green-500 mt-2">+2.2%</span>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-start">
              <span className="text-xs text-gray-400 mb-2">Solana</span>
              <span className="text-2xl font-bold text-gray-700">$150.00</span>
              <span className="text-xs text-green-500 mt-2">+6.1%</span>
            </div>
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
        {/* Transaktionen */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Letzte Transaktionen</h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center text-xl"><FaBitcoin className="text-yellow-500" /></div>
            <div className="flex-1">
              <div className="font-semibold text-gray-700">BTC Kauf</div>
              <div className="text-xs text-gray-400">12:42:00 PM</div>
            </div>
            <div className="text-gray-700 font-semibold">+0.05 BTC</div>
            <div className="text-green-500 text-xs">Eingang</div>
            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">Abgeschlossen</div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-xl"><FaEthereum className="text-blue-500" /></div>
            <div className="flex-1">
              <div className="font-semibold text-gray-700">ETH Verkauf</div>
              <div className="text-xs text-gray-400">10:15:00 AM</div>
            </div>
            <div className="text-gray-700 font-semibold">-1.2 ETH</div>
            <div className="text-red-500 text-xs">Abgang</div>
            <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">Fehlgeschlagen</div>
          </div>
        </section>
      </main>
    </div>
  );
}
