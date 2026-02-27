"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // For the Admin button fix
import { getInitialData } from "./actions";

export default function Storefront() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [liveTicker, setLiveTicker] = useState("Welcome to Pure Drop!");
  const [selectedBrand, setSelectedBrand] = useState("PURE DROP");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStore() {
      try {
        const data = await getInitialData();
        setInventory(data.inventory);
        setLiveTicker(data.liveTicker);
      } catch (error) {
        console.error("Storefront error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, []);

  // Filter logic: Ensure it shows items for the selected brand
  const filteredInventory = inventory.filter(
    (item) => item.brand.toUpperCase() === selectedBrand.toUpperCase()
  );

  // Get all unique brands currently in your database
  const availableBrands = Array.from(new Set(inventory.map(i => i.brand.toUpperCase())));

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-blue-900 uppercase italic">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* 1. TICKER */}
      <div className="bg-[#1e40af] text-white py-3 shadow-lg">
        <p className="animate-pulse text-center font-black uppercase tracking-[0.2em] text-[10px]">{liveTicker}</p>
      </div>

      {/* 2. HEADER - FIXED ADMIN BUTTON */}
      <header className="bg-white px-8 py-6 flex justify-between items-center border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <Link href="/dashboard" className="text-[10px] font-black text-blue-600 uppercase italic tracking-tighter border-2 border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition-all">
          Admin
        </Link>
        <h1 className="font-black text-3xl text-[#1e3a8a] tracking-tighter italic uppercase flex items-center gap-2">
          Pure Drop
        </h1>
        <div className="text-[#1e3a8a] text-2xl cursor-pointer">🛒</div>
      </header>

      <main className="max-w-6xl mx-auto p-8 pt-16">
        {/* 3. BRAND SELECTOR - SHOWS ALL BRANDS */}
        <div className="flex flex-col items-center mb-20">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Select Your Brand</label>
          <select 
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-white border-[6px] border-white shadow-xl px-12 py-5 rounded-[2rem] font-black text-blue-900 uppercase italic tracking-tighter outline-none cursor-pointer text-lg min-w-[300px] text-center"
          >
            {/* If database is empty, show default; otherwise list all available */}
            {availableBrands.length > 0 ? (
              availableBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)
            ) : (
              <option>PURE DROP</option>
            )}
          </select>
        </div>

        {/* 4. PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {filteredInventory.map((item) => (
            <div key={item.id} className="bg-[#2563eb] text-white rounded-[3rem] shadow-2xl overflow-hidden transform transition-all hover:-translate-y-2">
              <div className="p-10 flex flex-col items-center">
                <h4 className="font-black text-lg uppercase tracking-widest mb-1 italic">{item.product.split(' ')[0]}</h4>
                <p className="text-[9px] font-bold text-blue-200 uppercase mb-8">{item.product}</p>
                <div className="bg-[#1d4ed8] w-full py-5 rounded-3xl mb-8 border border-blue-400/20 text-center">
                  <span className="font-black text-3xl italic">₹{item.price}</span>
                </div>
                <button className="bg-white text-[#2563eb] w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-50">
                  + Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 5. NEW FOOTER - SWAPPED CARDS AS REQUESTED */}
      <footer className="max-w-6xl mx-auto px-8 py-20 mt-20 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* GALLERY CARD */}
          <button className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center group hover:bg-blue-50 transition-all">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🖼️</div>
            <h5 className="font-black text-[#1e3a8a] uppercase italic tracking-tighter text-xl">View Gallery</h5>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">See our distribution center</p>
          </button>
          
          {/* LOCATION CARD */}
          <button className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center group hover:bg-blue-50 transition-all">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📍</div>
            <h5 className="font-black text-[#1e3a8a] uppercase italic tracking-tighter text-xl">Store Location</h5>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Tumkur, Karnataka</p>
          </button>
        </div>
        
        {/* Simple Credit */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Pure Drop © 2026</p>
        </div>
      </footer>
    </div>
  );
}