"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaWhatsapp, FaPhoneAlt, FaEnvelope, FaTimes, FaCheckCircle, 
  FaChevronDown, FaWater, FaMapMarkerAlt, FaClock, FaShoppingCart, FaTrash, FaCommentDots 
} from "react-icons/fa";

// --- DEFAULT PRODUCT DATA ---
const brandsData = {
  "Pure Drop": {
    "500ml": { id: "pd-500", name: "500ml (Case of 24)", price: 180, color: "bg-blue-500" },
    "1L": { id: "pd-1l", name: "1L (Case of 12)", price: 240, color: "bg-blue-600" },
    "2L": { id: "pd-2l", name: "2L (Case of 9)", price: 270, color: "bg-blue-700" },
    "20L": { id: "pd-20l", name: "20L Water Can", price: 40, color: "bg-blue-800" },
  },
  "Bisleri": {
    "500ml": { id: "bi-500", name: "500ml Bisleri (24)", price: 240, color: "bg-teal-500" },
    "1L": { id: "bi-1l", name: "1L Bisleri (12)", price: 300, color: "bg-teal-600" },
    "2L": { id: "bi-2l", name: "2L Bisleri (9)", price: 350, color: "bg-teal-700" },
    "20L": { id: "bi-20l", name: "20L Bisleri Can", price: 90, color: "bg-teal-800" },
  },
  "Kinley": {
    "500ml": { id: "ki-500", name: "500ml Kinley (24)", price: 220, color: "bg-cyan-500" },
    "1L": { id: "ki-1l", name: "1L Kinley (12)", price: 280, color: "bg-cyan-600" },
    "2L": { id: "ki-2l", name: "2L Kinley (9)", price: 330, color: "bg-cyan-700" },
    "20L": { id: "ki-20l", name: "20L Kinley Can", price: 85, color: "bg-cyan-800" },
  }
};

const brandNames = Object.keys(brandsData);

export default function Home() {
  const [activeBrand, setActiveBrand] = useState(brandNames[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", specialRequest: "" });
  
  // LIVE DATA STATES
  const [liveBrandsData, setLiveBrandsData] = useState(brandsData);
  const [tickerText, setTickerText] = useState("✨ 24/7 Doorstep Delivery ✨ Bundle your orders and save! ✨ Managed by Gowtham Rathod ✨");

  // --- NEW: STATE FOR ADD TO CART POPUP ---
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<{product: any, brand: string} | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  // LOAD LIVE DATA FROM BRIDGE
  useEffect(() => {
    // 1. Load Live Notification Ticker
    const savedTicker = localStorage.getItem("pureDropTicker");
    if (savedTicker) {
      setTickerText(savedTicker);
    }

    // 2. Load Live Inventory Prices
    const savedInventory = JSON.parse(localStorage.getItem("pureDropInventory") || "[]");
    if (savedInventory.length > 0) {
      const updatedData = JSON.parse(JSON.stringify(brandsData)); 
      
      savedInventory.forEach((item: any) => {
        let sizeKey = "";
        if (item.product.includes("20L")) sizeKey = "20L";
        else if (item.product.includes("2L")) sizeKey = "2L";
        else if (item.product.includes("1L")) sizeKey = "1L";
        else if (item.product.includes("500ml")) sizeKey = "500ml";

        if (sizeKey && updatedData[item.brand] && updatedData[item.brand][sizeKey]) {
          updatedData[item.brand][sizeKey].price = item.price;
        }
      });
      
      setLiveBrandsData(updatedData);
    }
  }, []);

  const currentProducts = liveBrandsData[activeBrand as keyof typeof liveBrandsData] || {};

  // --- NEW: CONFIRM ADD TO CART LOGIC ---
  const confirmAddToCart = () => {
    if (!selectedProductToAdd) return;
    const { product, brand } = selectedProductToAdd;

    const existingItem = cart.find(item => item.id === product.id && item.brand === brand);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item));
    } else {
      setCart([...cart, { ...product, brand, quantity: quantityToAdd }]);
    }
    
    // Close modal and reset quantity
    setSelectedProductToAdd(null);
    setQuantityToAdd(1);
    setIsCartOpen(true); // Automatically open the cart so they see it was added
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) return;
    setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQty } : item));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // SAVE ORDER TO BRIDGE & WHATSAPP
  const handleFinalOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    let orderDetails = cart.map(item => `- ${item.brand} ${item.name} x${item.quantity} (₹${item.price * item.quantity})`).join("%0A");
    const requestText = formData.specialRequest ? `%0A%0A*SPECIAL REQUEST:* ${formData.specialRequest}` : "";
    const message = `*BULK ORDER FROM PURE DROP*%0A%0A*ITEMS:*%0A${orderDetails}%0A%0A*TOTAL AMOUNT:* ₹${cartTotal}%0A%0A*CUSTOMER:* ${formData.name}%0A*PHONE:* ${formData.phone}%0A*ADDRESS:* ${formData.address}${requestText}`;
    
    const newAdminOrder = {
      id: "ORD" + Math.floor(Math.random() * 10000),
      date: new Date().toLocaleDateString(),
      customer: formData.name,
      items: cart.map(item => `${item.brand} ${item.name} x${item.quantity}`).join(", "),
      total: cartTotal,
      status: "Pending"
    };

    const existingOrders = JSON.parse(localStorage.getItem("pureDropOrders") || "[]");
    localStorage.setItem("pureDropOrders", JSON.stringify([newAdminOrder, ...existingOrders]));

    window.open(`https://wa.me/918792837678?text=${message}`, "_blank");
    setCart([]);
    setIsCartOpen(false);
    setFormData({ name: "", phone: "", address: "", specialRequest: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-blue-50 relative font-sans text-slate-900">
      
      <div className="bg-blue-600 text-white py-2 overflow-hidden whitespace-nowrap border-b border-blue-700">
        <div className="animate-marquee inline-block px-4 font-bold uppercase tracking-widest text-[10px] md:text-xs">
           {tickerText}
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-[10px] font-black text-blue-600 border border-blue-100 px-3 py-1 rounded-md uppercase">Admin</Link>
        <div className="flex items-center gap-2">
          <FaWater className="text-blue-500 text-xl" />
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-blue-900 italic uppercase">PURE DROP</h1>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-blue-900 hover:scale-110 transition-transform">
          <FaShoppingCart size={24} />
          {cart.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cart.length}</span>}
        </button>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-12">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(currentProducts).map(([key, product]: [string, any]) => (
            <div key={product.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-blue-50 shadow-lg hover:shadow-2xl transition-all flex flex-col">
              <div className={`h-32 ${product.color} flex items-center justify-center text-white relative`}>
                 <span className="text-4xl opacity-20"><FaWater /></span>
                 <p className="absolute bottom-2 left-4 font-black text-xl uppercase tracking-tighter opacity-40">{key}</p>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-black text-blue-900 text-sm leading-tight mb-4 uppercase">{product.name}</h3>
                <div className="flex items-center justify-between mb-6 bg-blue-50 p-2 rounded-xl">
                  <span className="text-lg font-black text-blue-600">₹{product.price}</span>
                </div>
                {/* --- CHANGED: NOW OPENS POPUP INSTEAD OF DIRECTLY ADDING --- */}
                <button 
                  onClick={() => {
                    setSelectedProductToAdd({ product, brand: activeBrand });
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

        <div className="mt-28 max-w-4xl mx-auto bg-blue-900 rounded-[3rem] p-8 text-white flex flex-col md:flex-row items-center gap-8 shadow-3xl overflow-hidden relative">
          <div className="w-32 h-32 bg-white rounded-3xl flex-shrink-0 flex items-center justify-center text-blue-900 font-black text-xl shadow-xl">PHOTO</div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black mb-1 uppercase italic">Gowtham Rathod</h2>
            <p className="text-blue-300 font-black uppercase tracking-widest text-[10px] mb-4">Owner & Distributor</p>
            <div className="flex gap-4 justify-center md:justify-start">
               <a href="tel:+918782837678" className="bg-white/10 px-4 py-2 rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-white/20 transition-all"><FaPhoneAlt /> CALL</a>
               <a href="https://wa.me/918782837678" className="bg-green-500 px-4 py-2 rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-green-600 transition-all"><FaWhatsapp /> CHAT</a>
            </div>
          </div>
        </div>

        <section className="mt-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-blue-50 space-y-8 flex flex-col justify-center">
            <h3 className="text-xl font-black text-blue-900 uppercase italic">Store Location</h3>
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-blue-500 mt-1 text-xl shrink-0" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Our Address</p>
                <p className="text-base font-bold text-slate-700 leading-relaxed">
                  Pure Drop Water Agency,<br />
                  Main Road, Near Vidya School,<br />
                  Tumakuru, Karnataka - 572106
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <FaClock className="text-blue-500 mt-1 text-xl shrink-0" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Store Hours</p>
                <p className="text-base font-bold text-slate-700">Mon - Sun: 7:00 AM - 9:00 PM</p>
              </div>
            </div>
          </div>
          <div className="h-[300px] md:h-auto rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white bg-slate-200">
            <iframe 
              src="https://maps.google.com/?cid=18166508561865707155&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ2" 
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>
        </section>

        <section className="mt-28 w-full max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tighter italic">Our Gallery</h2>
            <p className="text-blue-500 font-bold uppercase tracking-widest text-[10px] mt-2">Glimpses of our pure distribution process</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group relative h-64 bg-slate-200 rounded-3xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs uppercase tracking-widest">Shop Front</div>
            </div>
            <div className="group relative h-64 bg-slate-200 rounded-3xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2">
               <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs uppercase tracking-widest">Delivery Truck</div>
            </div>
            <div className="group relative md:row-span-2 h-full min-h-[300px] bg-slate-200 rounded-3xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2">
               <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs uppercase tracking-widest">Stock Inventory</div>
            </div>
            <div className="group relative h-64 bg-slate-200 rounded-3xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2">
               <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs uppercase tracking-widest">Pure Cans</div>
            </div>
            <div className="group relative h-64 bg-slate-200 rounded-3xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2">
               <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs uppercase tracking-widest">Happy Customer</div>
            </div>
            <div className="group relative h-64 bg-slate-200 rounded-3xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2 md:col-span-2">
               <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs uppercase tracking-widest">Bulk Delivery</div>
            </div>
          </div>
        </section>
      </main>

      {/* --- NEW: QUANTITY SELECTOR POPUP --- */}
      {selectedProductToAdd && (
        <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-sm p-8 relative animate-in zoom-in duration-200">
            <button onClick={() => setSelectedProductToAdd(null)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors">
              <FaTimes size={24} />
            </button>
            
            <h3 className="text-2xl font-black text-blue-900 mb-2 uppercase italic tracking-tighter">Select Quantity</h3>
            <p className="text-slate-500 font-bold mb-8 text-sm">{selectedProductToAdd.brand} - {selectedProductToAdd.product.name}</p>
            
            <div className="flex items-center justify-between bg-blue-50 p-6 rounded-[2rem] mb-8 border border-blue-100">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Total Price</span>
                <span className="font-black text-blue-900 text-3xl italic">₹{selectedProductToAdd.product.price * quantityToAdd}</span>
              </div>
              
              <div className="flex items-center border-4 border-white bg-white rounded-2xl px-2 shadow-sm">
                <button onClick={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))} className="p-3 font-black text-blue-900 hover:text-blue-500 transition-colors">-</button>
                <span className="px-4 font-black text-xl text-blue-900">{quantityToAdd}</span>
                <button onClick={() => setQuantityToAdd(quantityToAdd + 1)} className="p-3 font-black text-blue-900 hover:text-blue-500 transition-colors">+</button>
              </div>
            </div>
            
            <button onClick={confirmAddToCart} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 uppercase tracking-widest flex items-center justify-center gap-3 transition-all text-xs">
              <FaShoppingCart /> Confirm & Add
            </button>
          </div>
        </div>
      )}

      {/* --- CART POP-UP --- */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-lg flex items-center justify-end z-[110]">
           <div className="bg-white h-full w-full max-w-md p-8 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-blue-900 uppercase italic">Your Cart</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><FaTimes size={28} /></button>
              </div>
              <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 font-bold italic">Your cart is empty...</div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="bg-blue-50 p-4 rounded-2xl flex items-center justify-between border border-blue-100">
                       <div>
                         <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{item.brand}</p>
                         <h4 className="font-black text-blue-900 text-sm">{item.name}</h4>
                         <p className="font-bold text-blue-600 text-sm">₹{item.price * item.quantity}</p>
                       </div>
                       <div className="flex items-center gap-3">
                         <div className="flex items-center border-2 border-white bg-white rounded-lg px-2">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 font-black">-</button>
                            <span className="px-3 font-black text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 font-black">+</button>
                         </div>
                         <button onClick={() => removeFromCart(item.id)} className="text-red-300 hover:text-red-500"><FaTrash /></button>
                       </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <form onSubmit={handleFinalOrder} className="mt-8 pt-6 border-t-2 border-slate-100 space-y-4">
                  <input required placeholder="Full Name" value={formData.name} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-black focus:border-blue-500 outline-none transition-all" onChange={(e) => setFormData({...formData, name: e.target.value})}/>
                  <input required type="tel" placeholder="Phone Number" value={formData.phone} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-black focus:border-blue-500 outline-none transition-all" onChange={(e) => setFormData({...formData, phone: e.target.value})}/>
                  <textarea required placeholder="Delivery Address" value={formData.address} rows={2} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-xl font-black focus:border-blue-500 outline-none transition-all" onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
                  <div className="relative group">
                    <FaCommentDots className="absolute top-4 left-4 text-blue-300 group-focus-within:text-blue-500 transition-colors" />
                    <textarea 
                      placeholder="Special Request (e.g. Leave at door)" 
                      rows={2}
                      value={formData.specialRequest} 
                      className="w-full bg-blue-50/50 border-2 border-blue-100 p-4 pl-12 rounded-xl font-bold text-sm text-blue-900 focus:border-blue-500 focus:bg-white outline-none transition-all" 
                      onChange={(e) => setFormData({...formData, specialRequest: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Grand Total</span>
                    <span className="text-3xl font-black text-blue-900 italic tracking-tighter">₹{cartTotal}</span>
                  </div>
                  <button type="submit" className="w-full bg-green-500 text-white font-black py-5 rounded-2xl hover:bg-green-600 shadow-xl uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                    <FaWhatsapp size={20}/> Send Combined Order
                  </button>
                </form>
              )}
           </div>
        </div>
      )}

      <footer className="text-center py-10 text-slate-400 font-black text-[9px] uppercase tracking-[0.4em]">
        © 2026 Pure Drop • Managed by Gowtham Rathod • Tech by Manoj
      </footer>

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #dbeafe; border-radius: 10px; }
      `}</style>
    </div>
  );
}