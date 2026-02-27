"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaWhatsapp, FaPhoneAlt, FaTimes, FaChevronDown, 
  FaWater, FaMapMarkerAlt, FaClock, FaShoppingCart, FaTrash, FaCommentDots 
} from "react-icons/fa";

// LIVE DATABASE ENGINE
import { getInitialData } from "./actions";

export default function Home() {
  const [activeBrand, setActiveBrand] = useState("Pure Drop");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", specialRequest: "" });
  
  // LIVE DATABASE STATES
  const [inventory, setInventory] = useState<any[]>([]);
  const [tickerText, setTickerText] = useState("✨ 24/7 Doorstep Delivery ✨ Managed by Gowtham Rathod ✨");
  const [loading, setLoading] = useState(true);

  // ADD TO CART MODAL STATES
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<{product: any, brand: string} | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  // FETCH LIVE DATA FROM VERCEL POSTGRES
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

  // Filter products based on the brand selected in dropdown
  const currentProducts = inventory.filter(
    (item) => item.brand.toLowerCase() === activeBrand.toLowerCase()
  );

  const brandNames = Array.from(new Set(inventory.map(i => i.brand)));

  // CART LOGIC
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

  // WHATSAPP ORDER SUBMISSION
  const handleFinalOrder = (e: React.FormEvent) => {
    e.preventDefault();
    let orderDetails = cart.map(item => `- ${item.brand} ${item.product} x${item.quantity} (₹${item.price * item.quantity})`).join("%0A");
    const requestText = formData.specialRequest ? `%0A%0A*SPECIAL REQUEST:* ${formData.specialRequest}` : "";
    const message = `*BULK ORDER FROM PURE DROP*%0A%0A*ITEMS:*%0A${orderDetails}%0A%0A*TOTAL AMOUNT:* ₹${cartTotal}%0A%0A*CUSTOMER:* ${formData.name}%0A*PHONE:* ${formData.phone}%0A*ADDRESS:* ${formData.address}${requestText}`;
    
    window.open(`https://wa.me/918792837678?text=${message}`, "_blank");
    setCart([]);
    setIsCartOpen(false);
    setFormData({ name: "", phone: "", address: "", specialRequest: "" });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <FaWater className="text-blue-500 text-6xl animate-bounce mb-4" />
      <p className="font-black text-blue-900 uppercase italic tracking-widest">Loading Pure Drop...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 relative font-sans text-slate-900 selection:bg-blue-200">
      
      {/* 1. NOTIFICATION TICKER */}
      <div className="bg-blue-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-blue-700 shadow-sm">
        <div className="animate-marquee inline-block px-4 font-bold uppercase tracking-widest text-[10px] md:text-xs">
           {tickerText}
        </div>
      </div>

      {/* 2. NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link href="/dashboard" className="text-[10px] font-black text-blue-600 border-2 border-blue-600 px-4 py-1.5 rounded-xl uppercase hover:bg-blue-600 hover:text-white transition-all">Admin</Link>
        <div className="flex items-center gap-2">
          <FaWater className="text-blue-500 text-xl" />
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-blue-900 italic uppercase">PURE DROP</h1>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-blue-900 hover:scale-110 transition-transform">
          <FaShoppingCart size={24} />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white animate-pulse">{cart.length}</span>}
        </button>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-12">
        {/* 3. BRAND SELECTOR */}
        <div className="max-w-md mx-auto mb-16 text-center relative z-30">
          <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-4">Select Your Brand</h2>
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-white border-4 border-blue-500 flex items-center justify-between rounded-3xl px-8 py-5 text-lg font-black shadow-[0_20px_40px_rgba(59,130,246,0.15)] hover:border-blue-600 transition-all">
              <span className="text-blue-900 uppercase italic">{activeBrand}</span>
              <FaChevronDown className={`text-blue-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-blue-100 rounded-[2rem] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {brandNames.map((brand) => (
                  <button key={brand} onClick={() => { setActiveBrand(brand); setIsDropdownOpen(false); }} className="w-full text-left px-8 py-5 font-black text-blue-900 hover:bg-blue-50 transition-colors border-b last:border-none uppercase italic tracking-tighter">
                    {brand}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. DYNAMIC PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentProducts.map((item) => (
            <div key={item.id} className="bg-white rounded-[3rem] overflow-hidden border border-blue-50 shadow-lg hover:shadow-2xl transition-all group flex flex-col">
              <div className={`h-36 bg-blue-600 flex items-center justify-center text-white relative overflow-hidden`}>
                 <FaWater className="text-6xl opacity-10 absolute scale-150" />
                 <p className="font-black text-2xl uppercase tracking-tighter italic opacity-80 z-10">{item.product.split(' ')[0]}</p>
              </div>
              <div className="p-8 flex flex-col flex-grow text-center">
                <h3 className="font-black text-blue-900 text-sm leading-tight mb-6 uppercase tracking-widest">{item.product}</h3>
                <div className="mb-8 bg-blue-50 py-4 rounded-[1.5rem] border border-blue-100 shadow-inner">
                  <span className="text-2xl font-black text-blue-700 italic">₹{item.price}</span>
                </div>
                <button 
                  onClick={() => {
                    setSelectedProductToAdd({ product: item, brand: activeBrand });
                    setQuantityToAdd(1);
                  }}
                  className="w-full bg-blue-900 text-white font-black py-4 rounded-2xl hover:bg-green-500 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 5. RESTORED OWNER SECTION */}
        <div className="mt-32 max-w-4xl mx-auto bg-[#1e3a8a] rounded-[3.5rem] p-10 text-white flex flex-col md:flex-row items-center gap-10 shadow-3xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="w-36 h-36 bg-white rounded-[2rem] flex-shrink-0 flex items-center justify-center text-blue-900 font-black text-2xl shadow-2xl italic border-4 border-blue-400 rotate-3">OWNER</div>
          <div className="text-center md:text-left z-10">
            <h2 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">Gowtham Rathod</h2>
            <p className="text-blue-300 font-black uppercase tracking-widest text-[11px] mb-6 opacity-80 italic">Managing Director & Logistics Head</p>
            <div className="flex gap-4 justify-center md:justify-start">
               <a href="tel:+918792837678" className="bg-white text-blue-900 px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-blue-50 transition-all shadow-lg"><FaPhoneAlt /> CALL NOW</a>
               <a href="https://wa.me/918792837678" className="bg-green-500 px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-900/20"><FaWhatsapp /> WHATSAPP</a>
            </div>
          </div>
        </div>

        {/* 6. LOCATION & INFO SECTION */}
        <section className="mt-32 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-blue-50 flex flex-col justify-center gap-10">
            <h3 className="text-2xl font-black text-blue-900 uppercase italic tracking-tighter flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span> Store Location
            </h3>
            <div className="flex items-start gap-5">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 shadow-inner"><FaMapMarkerAlt size={24} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Our Distribution Hub</p>
                <p className="text-lg font-bold text-slate-700 leading-relaxed italic">
                  Pure Drop Water Agency,<br />
                  Main Road, Near Vidya School,<br />
                  Tumakuru, Karnataka - 572106
                </p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-500 shadow-inner"><FaClock size={24} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Hours</p>
                <p className="text-lg font-bold text-slate-700 italic">Daily: 7:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>
          <div className="h-[400px] md:h-auto rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100 transform hover:scale-[1.02] transition-transform">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124440.12345678!2d77.03!3d13.33!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb02c3b!2sTumakuru!5e0!3m2!1sen!2sin!4v123456789" 
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              className="grayscale brightness-90 hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>
        </section>

        {/* 7. DYNAMIC GALLERY SECTION */}
        <section className="mt-32 mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tighter italic">Our Gallery</h2>
            <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mt-4">Pure Distribution • Quality Assured</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Pure Cans", url: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=600" },
              { title: "Delivery Hub", url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600" },
              { title: "Inventory", url: "https://images.unsplash.com/photo-1550505393-5c47113953c0?q=80&w=600", span: "md:row-span-2" },
              { title: "20L Stock", url: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=600" },
              { title: "Service", url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=600" },
              { title: "Bulk Supply", url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800", colSpan: "md:col-span-2" }
            ].map((img, idx) => (
              <div key={idx} className={`group relative h-64 md:h-auto min-h-[250px] overflow-hidden rounded-[2.5rem] shadow-xl transition-all duration-700 hover:-translate-y-4 ${img.span || ""} ${img.colSpan || ""}`}>
                <img src={img.url} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125" alt={img.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <span className="text-white font-black text-xs uppercase tracking-widest italic">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 8. QUANTITY POPUP MODAL */}
      {selectedProductToAdd && (
        <div className="fixed inset-0 bg-blue-950/90 backdrop-blur-xl flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
          <div className="bg-white rounded-[4rem] shadow-2xl w-full max-w-sm p-10 relative animate-in zoom-in duration-300">
            <button onClick={() => setSelectedProductToAdd(null)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors"><FaTimes size={24} /></button>
            <h3 className="text-3xl font-black text-blue-900 mb-2 uppercase italic tracking-tighter">Quantity</h3>
            <p className="text-slate-400 font-bold mb-10 text-xs uppercase tracking-widest">{selectedProductToAdd.product.product}</p>
            <div className="flex items-center justify-between bg-blue-50 p-8 rounded-[2.5rem] mb-10 border border-blue-100 shadow-inner">
              <span className="font-black text-blue-900 text-4xl italic tracking-tighter">₹{selectedProductToAdd.product.price * quantityToAdd}</span>
              <div className="flex items-center border-4 border-white bg-white rounded-2xl px-2 shadow-xl">
                <button onClick={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))} className="p-4 font-black text-blue-900 hover:text-blue-500 text-xl">-</button>
                <span className="px-5 font-black text-2xl text-blue-900">{quantityToAdd}</span>
                <button onClick={() => setQuantityToAdd(quantityToAdd + 1)} className="p-4 font-black text-blue-900 hover:text-blue-500 text-xl">+</button>
              </div>
            </div>
            <button onClick={confirmAddToCart} className="w-full bg-blue-600 text-white font-black py-6 rounded-3xl hover:bg-blue-700 shadow-2xl shadow-blue-200 uppercase tracking-widest flex items-center justify-center gap-4 transition-all active:scale-95 italic">
              <FaShoppingCart /> Add to Order
            </button>
          </div>
        </div>
      )}

      {/* 9. CART SIDEBAR OVERLAY */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-lg flex items-center justify-end z-[110] animate-in fade-in duration-300">
           <div className="bg-white h-full w-full max-w-md p-10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-y-auto">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter">Your Cart</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-300 hover:text-red-500 transition-all transform hover:rotate-90"><FaTimes size={32} /></button>
              </div>
              <div className="flex-grow space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-24">
                    <FaWater className="mx-auto text-blue-100 text-8xl mb-6" />
                    <p className="text-slate-400 font-bold italic uppercase tracking-widest text-xs">Your cart is dry...</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="bg-blue-50/50 p-6 rounded-[2rem] flex items-center justify-between border border-blue-100 shadow-sm">
                       <div>
                         <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">{item.brand}</p>
                         <h4 className="font-black text-blue-900 text-sm italic uppercase">{item.product}</h4>
                         <div className="flex items-center gap-4 mt-2">
                           <span className="font-black text-blue-600 text-base">₹{item.price * item.quantity}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase">x{item.quantity}</span>
                         </div>
                       </div>
                       <button onClick={() => removeFromCart(item.id)} className="bg-white p-3 rounded-xl text-red-200 hover:text-red-500 hover:shadow-md transition-all"><FaTrash size={16} /></button>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <form onSubmit={handleFinalOrder} className="mt-12 space-y-5 border-t-2 border-slate-50 pt-8">
                  <div className="space-y-4">
                    <input required placeholder="Your Name" value={formData.name} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black focus:border-blue-500 outline-none transition-all italic text-sm" onChange={(e) => setFormData({...formData, name: e.target.value})}/>
                    <input required type="tel" placeholder="WhatsApp Phone" value={formData.phone} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black focus:border-blue-500 outline-none transition-all italic text-sm" onChange={(e) => setFormData({...formData, phone: e.target.value})}/>
                    <textarea required placeholder="Delivery Address" value={formData.address} rows={2} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black focus:border-blue-500 outline-none transition-all italic text-sm" onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
                    <div className="relative group">
                      <FaCommentDots className="absolute top-5 left-5 text-blue-300" />
                      <textarea placeholder="Special Request (e.g. Leave at gate)" value={formData.specialRequest} rows={2} className="w-full p-5 pl-14 bg-blue-50/30 border-2 border-blue-100 rounded-2xl font-bold text-xs focus:border-blue-500 outline-none transition-all italic" onChange={(e) => setFormData({...formData, specialRequest: e.target.value})}></textarea>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-6">
                    <span className="font-black text-slate-300 uppercase text-[10px] tracking-[0.3em]">Grand Total</span>
                    <span className="text-4xl font-black text-blue-900 italic tracking-tighter">₹{cartTotal}</span>
                  </div>
                  <button type="submit" className="w-full bg-green-500 text-white font-black py-6 rounded-[2rem] hover:bg-green-600 shadow-2xl shadow-green-100 uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all italic text-xs">
                    <FaWhatsapp size={24}/> Order on WhatsApp
                  </button>
                </form>
              )}
           </div>
        </div>
      )}

      {/* 10. FOOTER SECTION */}
      <footer className="bg-white py-16 text-center border-t border-slate-100">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 opacity-30">
            <FaWater className="text-blue-900" />
            <span className="font-black text-blue-900 tracking-tighter italic uppercase text-xl">Pure Drop</span>
          </div>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.5em] px-4 leading-loose">
            © 2026 Pure Drop Water Logistics [cite: 2026-02-27] <br className="md:hidden" /> 
            Managed by Gowtham Rathod • Tech by Manoj
          </p>
        </div>
      </footer>

      {/* CUSTOM ANIMATIONS */}
      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #dbeafe; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>
    </div>
  );
}