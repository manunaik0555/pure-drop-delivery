"use client";

import { useState, useEffect } from "react";
import { getInitialData } from "./actions"; // Pulling the same live data!

export default function Storefront() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [liveTicker, setLiveTicker] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStoreData() {
      try {
        const data = await getInitialData();
        setInventory(data.inventory);
        setLiveTicker(data.liveTicker);
      } catch (error) {
        console.error("Storefront fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStoreData();
  }, []);

  if (loading) return <div className="text-center p-20 font-bold">Loading Pure Drop Store...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Ticker Section */}
      <div className="bg-blue-600 text-white py-2 overflow-hidden">
        <div className="whitespace-nowrap animate-marquee font-bold uppercase">
          {liveTicker}
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-black text-blue-900 mb-10 text-center uppercase italic">Available Stock</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {inventory.map((item) => (
            <div key={item.id} className="border-2 border-blue-50 p-6 rounded-[2rem] shadow-lg hover:scale-105 transition-transform">
              <p className="text-xs font-black text-blue-500 uppercase">{item.brand}</p>
              <h3 className="text-xl font-bold text-slate-800">{item.product}</h3>
              <div className="mt-4 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Price</p>
                  <p className="text-2xl font-black text-blue-900">₹{item.price}</p>
                </div>
                <p className={`text-xs font-bold ${item.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.stock > 0 ? `${item.stock} In Stock` : 'Out of Stock'}
                </p>
              </div>
              <button className="w-full mt-6 bg-blue-600 text-white font-black py-3 rounded-xl uppercase tracking-widest text-[10px]">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}