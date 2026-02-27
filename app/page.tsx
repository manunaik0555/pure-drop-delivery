"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaWhatsapp, FaPhoneAlt, FaChevronDown, 
  FaWater, FaShoppingCart, FaMapMarkerAlt, FaUserTie 
} from "react-icons/fa";
import { getInitialData } from "./actions";

export default function Home() {
  const [activeBrand, setActiveBrand] = useState("Pure Drop");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedProductToAdd, setSelectedProductToAdd] = useState<{product: any, brand: string} | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getInitialData();
        setInventory(data.inventory);
        if (data.inventory.length > 0) setActiveBrand(data.inventory[0].brand);
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const currentProducts = inventory.filter(item => item.brand.toLowerCase() === activeBrand.toLowerCase());
  const brandNames = Array.from(new Set(inventory.map(i => i.brand)));

  const confirmAddToCart = () => {
    if (!selectedProductToAdd) return;
    const { product, brand } = selectedProductToAdd;
    const existingItem = cart.find(item => item.id === product.id && item.brand === brand);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item));
    } else {
      setCart([...cart, { ...product, brand, quantity: quantityToAdd }]);
    }
    setSelectedProductToAdd(null);
    setQuantityToAdd(1);
    setIsCartOpen(true); 
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleFinalOrder = (e: React.FormEvent) => {
    e.preventDefault();
    let orderDetails = cart.map(item => `- ${item.brand} ${item.product} x${item.quantity}`).join("%0A");
    const message = `*ORDER FOR SEETHA MEHESH ENTERPRISES*%0A%0A*ITEMS:*%0A${orderDetails}%0A%0A*TOTAL:* ₹${cartTotal}%0A%0A*CUSTOMER:* ${formData.name}%0A*ADDRESS:* ${formData.address}`;
    window.open(`https://wa.me/918792837678?text=${message}`, "_blank");
    setCart([]);
    setIsCartOpen(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-blue-900 uppercase italic tracking-tighter">Loading Seetha Mehesh Enterprises...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* TICKER */}
      <div className="bg-blue-600 text-white py-2 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block px-4 font-bold uppercase tracking-widest text-[10px]">
           ✨ Seetha Mehesh Enterprises: Premium Water Distribution in Tumakuru ✨ Official Supplier ✨
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-[10px] font-black text-blue-600 border-2 border-blue-600 px-4 py-1.5 rounded-xl uppercase">Admin</Link>
        <div className="flex items-center gap-2">
          <FaWater className="text-blue-500 text-xl" />
          <h1 className="text-lg md:text-xl font-black tracking-tighter text-blue-900 italic uppercase">Seetha Mehesh Enterprises</h1>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-blue-900">
          <FaShoppingCart size={22} />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{cart.length}</span>}
        </button>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-12">
        {/* BRAND SELECTOR */}
        <div className="max-w-md mx-auto mb-16 text-center">
          <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Select Water Brand</h2>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-white border-4 border-blue-900 flex items-center justify-between rounded-3xl px-8 py-5 text-lg font-black shadow-xl uppercase italic">
            <span>{activeBrand}</span>
            <FaChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="mt-2 bg-white border rounded-3xl shadow-2xl overflow-hidden">
              {brandNames.map((brand) => (
                <button key={brand} onClick={() => { setActiveBrand(brand); setIsDropdownOpen(false); }} className="w-full text-left px-8 py-4 font-black hover:bg-blue-50 uppercase italic">
                  {brand}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentProducts.map((item) => (
            <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden border shadow-lg flex flex-col p-6">
              <div className="h-32 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-300">
                 <FaWater size={40} />
              </div>
              <h3 className="font-black text-blue-900 text-sm uppercase mb-4">{item.product}</h3>
              <div className="mb-6 py-3 bg-blue-900 text-white rounded-xl font-black italic text-center">₹{item.price}</div>
              <button 
                onClick={() => setSelectedProductToAdd({ product: item, brand: activeBrand })}
                className="w-full bg-green-500 text-white font-black py-4 rounded-xl uppercase text-[10px] tracking-wider"
              >
                Order Now
              </button>
            </div>
          ))}
        </div>

        {/* OWNER & DISTRIBUTOR CARD */}
        <div className="mt-32 max-w-4xl mx-auto bg-blue-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl border-b-8 border-blue-700">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-blue-900 shadow-inner">
             <FaUserTie size={50} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black mb-1 uppercase italic tracking-tighter">Gowtham Rathod</h2>
            <p className="text-blue-300 font-bold uppercase text-xs mb-6 tracking-widest">Owner & Distributor</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <a href="tel:+918792837678" className="bg-white text-blue-900 px-8 py-3 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-blue-50 transition-colors"><FaPhoneAlt /> CALL NOW</a>
               <a href="https://wa.me/918792837678" className="bg-green-500 px-8 py-3 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-green-600 transition-colors"><FaWhatsapp /> WHATSAPP</a>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER WITH STORE ADDRESS */}
      <footer className="bg-slate-50 py-16 text-center border-t mt-20 px-6">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
              <FaMapMarkerAlt />
              <span className="font-black uppercase text-xs tracking-widest">Store Address</span>
            </div>
            <p className="text-slate-600 font-bold uppercase text-sm leading-relaxed">
              Seetha Mehesh Enterprises, Tumakuru, Karnataka, India
            </p>
          </div>
          <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.2em]">
            © 2026 Seetha Mehesh Enterprises • All Rights Reserved
          </p>
      </footer>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
      `}</style>
    </div>
  );
}