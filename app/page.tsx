"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaWhatsapp, FaPhoneAlt, FaEnvelope, FaTimes, FaCheckCircle, 
  FaChevronDown, FaWater, FaMapMarkerAlt, FaClock, FaShoppingCart, FaTrash, FaCommentDots 
} from "react-icons/fa";

// Import the secure database engine we built
import { getInitialData } from "./actions";

export default function Home() {
  const [activeBrand, setActiveBrand] = useState("Pure Drop");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", specialRequest: "" });
  
  // LIVE DATA STATES
  const [inventory, setInventory] = useState<any[]>([]);
  const [tickerText, setTickerText] = useState("✨ 24/7 Doorstep Delivery ✨");
  const [loading, setLoading] = useState(true);

  // MODAL STATES
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<{product: any, brand: string} | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  // --- UPDATED: FETCH FROM CLOUD DATABASE ---
  useEffect(() => {
    async function loadCloudData() {
      try {
        const data = await getInitialData();
        setInventory(data.inventory);
        setTickerText(data.liveTicker);
        if (data.inventory.length > 0) {
          setActiveBrand(data.inventory[0].brand);
        }
      } catch (error) {
        console.error("Cloud fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCloudData();
  }, []);

  // Filter logic for your cards
  const currentProducts = inventory.filter(
    (item) => item.brand.toLowerCase() === activeBrand.toLowerCase()
  );

  const brandNames = Array.from(new Set(inventory.map(i => i.brand)));

  // --- LOGIC (UNTOUCHED) ---
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

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) return;
    setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQty } : item));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleFinalOrder = (e: React.FormEvent) => {
    e.preventDefault();
    let orderDetails = cart.map(item => `- ${item.brand} ${item.product} x${item.quantity} (₹${item.price * item.quantity})`).join("%0A");
    const requestText = formData.specialRequest ? `%0A%0A*SPECIAL REQUEST:* ${formData.specialRequest}` : "";
    const message = `*BULK ORDER FROM SEETHA MAHESH ENTERPRISES*%0A%0A*ITEMS:*%0A${orderDetails}%0A%0A*TOTAL AMOUNT:* ₹${cartTotal}%0A%0A*CUSTOMER:* ${formData.name}%0A*PHONE:* ${formData.phone}%0A*ADDRESS:* ${formData.address}${requestText}`;
    
    // Save to WA and clear
    window.open(`https://wa.me/916363273658?text=${message}`, "_blank");
    setCart([]);
    setIsCartOpen(false);
    setFormData({ name: "", phone: "", address: "", specialRequest: "" });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-blue-900 italic">LOADING...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 relative font-sans text-slate-900">
      
      {/* TICKER */}
      <div className="bg-blue-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-blue-700">
        <div className="animate-marquee inline-block px-4 font-bold uppercase tracking-widest text-[10px] md:text-xs">
           {tickerText}
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-[10px] font-black text-blue-600 border border-blue-100 px-3 py-1 rounded-md uppercase">Admin</Link>
        <div className="flex items-center gap-2">
          <FaWater className="text-blue-500 text-xl" />
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-blue-900 italic uppercase">SEETHA MAHESH ENTERPRISES</h1>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-blue-900 hover:scale-110 transition-transform">
          <FaShoppingCart size={24} />
          {cart.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cart.length}</span>}
        </button>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-12">
        {/* BRAND SELECTOR */}
        <div className="max-w-md mx-auto mb-16 text-center relative z-30">
          <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Select Your Brand</h2>
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-white border-4 border-blue-500 flex items-center justify-between rounded-2xl px-6 py-4 text-lg font-black shadow-xl hover:border-blue-600 transition-all">
              <span className="text-blue-900 uppercase">{activeBrand}</span>
              <FaChevronDown className={`text-blue-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-blue-100 rounded-3xl shadow-2xl overflow-hidden z-50">
                {brandNames.map((brand) => (
                  <button key={brand} onClick={() => { setActiveBrand(brand); setIsDropdownOpen(false); }} className="w-full text-left px-8 py-5 font-black hover:bg-blue-50 transition-colors border-b last:border-none uppercase tracking-tighter">
                    {brand}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* PRODUCT GRID - UPDATED FOR DB DATA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentProducts.map((item) => (
            <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-blue-50 shadow-lg hover:shadow-2xl transition-all flex flex-col">
              <div className={`h-32 bg-blue-600 flex items-center justify-center text-white relative`}>
                 <span className="text-4xl opacity-20"><FaWater /></span>
                 <p className="absolute bottom-2 left-4 font-black text-xl uppercase tracking-tighter opacity-40">{item.product.split(' ')[0]}</p>
              </div>
              <div className="p-6 flex flex-col flex-grow text-center">
                <h3 className="font-black text-blue-900 text-sm leading-tight mb-4 uppercase">{item.product}</h3>
                <div className="flex items-center justify-center mb-6 bg-blue-50 p-2 rounded-xl">
                  <span className="text-lg font-black text-blue-600">₹{item.price}</span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedProductToAdd({ product: item, brand: activeBrand });
                    setQuantityToAdd(1);
                  }}
                  className="w-full bg-blue-900 text-white font-black py-3 rounded-xl hover:bg-green-500 transition-all uppercase tracking-widest text-[9px] flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* OWNER SECTION */}
        <div className="mt-28 max-w-4xl mx-auto bg-blue-900 rounded-[3rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-3xl overflow-hidden relative">
          <div className="w-32 h-32 bg-white rounded-3xl flex-shrink-0 flex items-center justify-center text-blue-900 font-black text-xl shadow-xl italic">PHOTO</div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black mb-1 uppercase italic">Gowtham Rathod</h2>
            <p className="text-blue-300 font-black uppercase tracking-widest text-[10px] mb-4">Owner & Distributor</p>
            <div className="flex gap-4 justify-center md:justify-start">
               <a href="tel:+918782837678" className="bg-white/10 px-4 py-2 rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-white/20 transition-all"><FaPhoneAlt /> CALL</a>
               <a href="https://wa.me/916363273658" className="bg-green-500 px-4 py-2 rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-green-600 transition-all"><FaWhatsapp /> CHAT</a>
            </div>
          </div>
        </div>

        {/* LOCATION & GALLERY (UNTOUCHED STYLING) */}
        <section className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-blue-50 space-y-8 flex flex-col justify-center">
            <h3 className="text-xl font-black text-blue-900 uppercase italic">Store Location</h3>
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-blue-500 mt-1 text-xl shrink-0" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Our Address</p>
                <p className="text-base font-bold text-slate-700 leading-relaxed">
                  Seetha Mahesh Enterprises,<br />
                 bukkapattana Main Road, Near govardhan show room,<br />
                   sira ,Tumakuru, Karnataka - 572137
                </p>
              </div>
            </div>
          </div>
          <div className="h-[300px] md:h-auto rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white bg-slate-200">
            <iframe src="https://www.google.com/maps/embed?pb=YOUR_EMBED_HERE" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
          </div>
        </section>
      </main>

      {/* POPUPS (UNTOUCHED LOGIC) */}
      {selectedProductToAdd && (
        <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-sm p-8 relative animate-in zoom-in duration-200">
            <button onClick={() => setSelectedProductToAdd(null)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500"><FaTimes size={24} /></button>
            <h3 className="text-2xl font-black text-blue-900 mb-2 uppercase italic tracking-tighter">Select Quantity</h3>
            <div className="flex items-center justify-between bg-blue-50 p-6 rounded-[2rem] mb-8 border border-blue-100">
              <span className="font-black text-blue-900 text-3xl italic">₹{selectedProductToAdd.product.price * quantityToAdd}</span>
              <div className="flex items-center border-4 border-white bg-white rounded-2xl px-2 shadow-sm">
                <button onClick={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))} className="p-3 font-black text-blue-900">-</button>
                <span className="px-4 font-black text-xl text-blue-900">{quantityToAdd}</span>
                <button onClick={() => setQuantityToAdd(quantityToAdd + 1)} className="p-3 font-black text-blue-900">+</button>
              </div>
            </div>
            <button onClick={confirmAddToCart} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-3">
              <FaShoppingCart /> Confirm & Add
            </button>
          </div>
        </div>
      )}

      {/* CART OVERLAY (UNTOUCHED LOGIC) */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-lg flex items-center justify-end z-[110]">
           <div className="bg-white h-full w-full max-w-md p-8 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-blue-900 uppercase italic">Your Cart</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-red-500"><FaTimes size={28} /></button>
              </div>
              <div className="flex-grow space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-blue-50 p-4 rounded-2xl flex items-center justify-between">
                     <div>
                       <h4 className="font-black text-blue-900 text-sm">{item.product}</h4>
                       <p className="font-bold text-blue-600 text-sm">₹{item.price * item.quantity}</p>
                     </div>
                     <button onClick={() => removeFromCart(item.id)} className="text-red-300"><FaTrash /></button>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <form onSubmit={handleFinalOrder} className="mt-8 space-y-4">
                  <input required placeholder="Name" value={formData.name} className="w-full p-4 border-2 rounded-xl" onChange={(e) => setFormData({...formData, name: e.target.value})}/>
                  <input required placeholder="Phone" value={formData.phone} className="w-full p-4 border-2 rounded-xl" onChange={(e) => setFormData({...formData, phone: e.target.value})}/>
                  <textarea required placeholder="Address" value={formData.address} className="w-full p-4 border-2 rounded-xl" onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
                  <button type="submit" className="w-full bg-green-500 text-white font-black py-5 rounded-2xl">
                    <FaWhatsapp size={20} className="inline mr-2"/> Order via WhatsApp
                  </button>
                </form>
              )}
           </div>
        </div>
      )}

      <footer className="text-center py-10 text-slate-400 font-black text-[9px] uppercase tracking-[0.4em]">
        © 2026 SEETHA MAHESH  ENTERPRISES • Managed by Gowtham Rathod • Tech by ManU
      </footer>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
      `}</style>
    </div>
  );
}