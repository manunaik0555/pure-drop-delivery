"use client";

import { useState, useEffect } from "react";
import { getInitialData } from "./actions";

export default function Storefront() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [liveTicker, setLiveTicker] = useState("Loading Store...");
  const [selectedBrand, setSelectedBrand] = useState("PURE DROP");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStore() {
      try {
        const data = await getInitialData();
        setInventory(data.inventory);
        setLiveTicker(data.liveTicker);
        if (data.inventory.length > 0) setSelectedBrand(data.inventory[0].brand.toUpperCase());
      } catch (error) {
        console.error("Storefront error:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, []);

  const filteredInventory = inventory.filter(
    (item) => item.brand.toUpperCase() === selectedBrand.toUpperCase()
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-blue-900 uppercase italic">Loading Pure Drop...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-100">
      {/* 1. PREMIUM TICKER */}
      <div className="bg-[#1e40af] text-white py-3 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <p className="animate-pulse text-center font-black uppercase tracking-[0.2em] text-[10px]">
            {liveTicker}
          </p>
        </div>
      </div>

      {/* 2. DESIGNER HEADER */}
      <header className="bg-white px-8 py-6 flex justify-between items-center border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="text-[10px] font-black text-blue-600 uppercase italic tracking-tighter border-2 border-blue-600 px-2 py-1 rounded">Admin</div>
        <h1 className="font-black text-3xl text-[#1e3a8a] tracking-tighter italic uppercase flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
          Pure Drop
        </h1>
        <div className="text-[#1e3a8a] text-2xl hover:scale-110 transition-transform cursor-pointer">🛒</div>
      </header>

      <main className="max-w-6xl mx-auto p-8 pt-16">
        {/* 3. BRAND SELECTOR - MATCHING SCREENSHOT */}
        <div className="flex flex-col items-center mb-20">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Select Your Brand</label>
          <div className="relative group">
            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-white border-[6px] border-white shadow-[0_20px_50px_rgba(30,58,138,0.15)] px-12 py-5 rounded-[2rem] font-black text-blue-900 uppercase italic tracking-tighter outline-none cursor-pointer appearance-none min-w-[300px] text-center text-lg"
            >
              {Array.from(new Set(inventory.map(i => i.brand.toUpperCase()))).map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">▼</div>
          </div>
        </div>

        {/* 4. PRODUCT GRID - THE BLUE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {filteredInventory.map((item) => (
            <div key={item.id} className="bg-[#2563eb] text-white rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(37,99,235,0.4)] overflow-hidden transform transition-all duration-300 hover:-translate-y-4 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.5)]">
              <div className="p-10 flex flex-col items-center">
                {/* Visual Icon Area */}
                <div className="mb-8 opacity-20">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 14"/></svg>
                </div>
                
                <h4 className="font-black text-lg uppercase tracking-widest mb-1 italic">{item.product.split(' ')[0]}</h4>
                <p className="text-[10px] font-bold text-blue-100 uppercase mb-8 tracking-widest opacity-80">{item.product}</p>
                
                <div className="bg-[#1d4ed8] w-full py-5 rounded-3xl mb-8 border border-blue-400/20 shadow-inner">
                  <span className="font-black text-3xl tracking-tighter italic">₹{item.price}</span>
                </div>

                <button className="bg-white text-[#2563eb] w-full py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-50 transition-all active:scale-95">
                  + Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 5. AUTHOR PROFILES */}
      <footer className="max-w-6xl mx-auto px-8 py-20 mt-20 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-center items-center gap-16">
          <div className="flex flex-col items-center group">
            <div className="w-20 h-20 bg-[#1e3a8a] rounded-3xl rotate-3 group-hover:rotate-12 transition-transform flex items-center justify-center text-white font-black italic shadow-xl mb-4">MN</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead Developer</p>
            <h5 className="font-black text-[#1e3a8a] uppercase italic tracking-tighter text-lg">Manu Naik K</h5>
          </div>
          
          <div className="flex flex-col items-center group">
            <div className="w-20 h-20 bg-[#2563eb] rounded-3xl -rotate-3 group-hover:-rotate-12 transition-transform flex items-center justify-center text-white font-black italic shadow-xl mb-4">UI</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">UI/UX Designer</p>
            <h5 className="font-black text-[#1e3a8a] uppercase italic tracking-tighter text-lg">Design Team</h5>
          </div>
        </div>
      </footer>
    </div>
  );
}