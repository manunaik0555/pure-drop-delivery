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
        if (data.inventory.length > 0) {
          setSelectedBrand(data.inventory[0].brand);
        }
      } catch (error) {
        console.error("Failed to load storefront:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStore();
  }, []);

  const filteredInventory = inventory.filter(
    (item) => item.brand.toUpperCase() === selectedBrand.toUpperCase()
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-black text-blue-900 uppercase italic">
      Initializing Pure Drop...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 1. TICKER - Restored Original Pulse Style */}
      <div className="bg-blue-600 text-white py-3 overflow-hidden shadow-md">
        <div className="whitespace-nowrap animate-pulse px-4 text-center font-black uppercase tracking-widest text-[10px]">
          {liveTicker}
        </div>
      </div>

      {/* 2. HEADER - Restored Minimalist Style */}
      <header className="bg-white p-6 flex justify-between items-center border-b border-slate-100">
        <div className="text-[10px] font-black text-blue-600 uppercase italic">Admin</div>
        <div className="flex flex-col items-center">
          <div className="h-1 w-8 bg-blue-600 mb-1 rounded-full"></div>
          <h1 className="font-black text-2xl text-blue-900 tracking-tighter italic uppercase">Pure Drop</h1>
        </div>
        <div className="text-blue-900">🛒</div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {/* 3. SELECTOR - Restored */}
        <div className="flex flex-col items-center mb-12">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Select Your Brand</label>
          <select 
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-white border-4 border-white shadow-xl px-10 py-4 rounded-2xl font-black text-blue-900 uppercase italic tracking-tighter outline-none cursor-pointer"
          >
            {Array.from(new Set(inventory.map(i => i.brand))).map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* 4. PRODUCT GRID - Restored Blue Card Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredInventory.map((item) => (
            <div key={item.id} className="bg-blue-600 text-white p-1 rounded-[2.5rem] shadow-2xl transition-transform hover:scale-105">
              <div className="p-8 flex flex-col items-center text-center">
                {/* Product Size Title */}
                <h4 className="font-black text-sm uppercase tracking-widest mb-1">{item.product.split(' ')[0]}</h4>
                <p className="text-[9px] font-bold text-blue-200 uppercase mb-6">{item.product}</p>
                
                {/* Price Label Styling */}
                <div className="bg-blue-500/30 w-full py-4 rounded-2xl mb-6 border border-blue-400/20">
                  <span className="font-black text-2xl tracking-tighter">₹{item.price}</span>
                </div>

                {/* Add to Cart Button Styling */}
                <button className="bg-white text-blue-600 w-full py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-100 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 5. AUTHOR PROFILES - As requested */}
      <footer className="max-w-6xl mx-auto p-12 mt-12 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          {/* Developer Profile */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center text-white font-black italic">MN</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Developer</p>
            <h5 className="font-black text-blue-900 uppercase italic tracking-tighter">Manu Naik K</h5>
          </div>
          {/* UI/UX Profile */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-black italic">UI</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UI/UX Designer</p>
            <h5 className="font-black text-blue-900 uppercase italic tracking-tighter">Designer Team</h5>
          </div>
        </div>
      </footer>
    </div>
  );
}