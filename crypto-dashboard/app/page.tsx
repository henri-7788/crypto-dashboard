import React from "react";
import { FaRegBell, FaRegUserCircle, FaSearch } from "react-icons/fa";
// Remove react-icons/fa import due to missing module

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f8fc] flex">
      {/* Sidebar */}
      <aside className="w-20 bg-white shadow-lg flex flex-col items-center py-8 rounded-3xl m-4">
        <div className="mb-8">
          <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
        </div>
        <nav className="flex flex-col gap-8 text-gray-400 text-2xl">
          <button className="hover:text-indigo-500 transition-colors">🏠</button>
          <button className="hover:text-indigo-500 transition-colors">📄</button>
          <button className="hover:text-indigo-500 transition-colors">📊</button>
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
            <h1 className="text-2xl font-bold text-gray-800">Good Morning David</h1>
            <p className="text-gray-400 text-sm">Your weekly financial update</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search here"
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
        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Platzhalter für Cards */}
          <div className="bg-white rounded-2xl shadow p-6 h-32 flex items-center justify-center text-gray-400 font-semibold">
            Card 1
          </div>
          <div className="bg-white rounded-2xl shadow p-6 h-32 flex items-center justify-center text-gray-400 font-semibold">
            Card 2
          </div>
          <div className="bg-white rounded-2xl shadow p-6 h-32 flex items-center justify-center text-gray-400 font-semibold">
            Card 3
          </div>
          <div className="bg-white rounded-2xl shadow p-6 h-32 flex items-center justify-center text-gray-400 font-semibold">
            Card 4
          </div>
        </section>
        {/* Weitere Sektionen wie Invoices, Graph, History folgen später */}
      </main>
    </div>
  );
}
