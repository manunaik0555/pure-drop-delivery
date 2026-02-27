"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaWhatsapp, FaPhoneAlt, FaTimes, FaChevronDown, 
  FaWater, FaMapMarkerAlt, FaClock, FaShoppingCart, FaTrash, FaCommentDots 
} from "react-icons/fa";
import { getInitialData, getGalleryImages } from "./actions";

export default function Home() {
  const [activeBrand, setActiveBrand] = useState("Pure Drop");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", address: "", specialRequest: "" });
  const [inventory, setInventory] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [tickerText, setTickerText] = useState("✨ Seetha Mehesh Enterprises: Premium Water Distribution ✨");
  const [loading, setLoading] = useState(true);

  // CART MODAL STATES
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<{product: any, brand: string} | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);

  useEffect(() => {
    async function loadData() {
      try {
        const [data, images] = await Promise.all([getInitialData(), getGalleryImages()]);
        setInventory(data.inventory);
        setGalleryItems(images);
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

  const removeFromCart = (productId: string) => setCart(cart.filter(item => item.id !== productId));
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleFinalOrder = (e: React.FormEvent) => {
    e.preventDefault();
    let orderDetails = cart.map(item => `- ${item.brand} ${item.product} x${item.quantity}`).join("%0A");
    const message = `*ORDER FOR SEETHA MEHESH ENTERPRISES*%0A%0A*ITEMS:*%0A${orderDetails}%0A%0A*TOTAL:* ₹${cartTotal}%0A%0A*CUSTOMER:* ${formData.name}%0A*ADDRESS:* ${formData.address}`;
    window.open(`https://wa.me/918792837678?text=${message}`, "_blank");
    setCart([]);
    setIsCartOpen(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-blue-900 uppercase italic">Loading SME Shop...</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* NOTIFICATION TICKER */}
      <div className="bg-blue-600 text-white py-2 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block px-4 font-bold uppercase tracking-widest text-xs">
           ✨ Quality Water Distribution by Seetha Mehesh Enterprises ✨ Tumakuru's Trusted Supplier ✨
        </div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-[10px] font-black text-blue-600 border-2 border-blue-600 px-4 py-1.5 rounded-xl uppercase">Admin</Link>
        <div className="flex items-center gap-2">
          <FaWater className="text-blue-500 text-xl" />
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-blue-900 italic uppercase">SME WATER</h1>
        </div>
        <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-blue-900">
          <FaShoppingCart size={24} />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{cart.length}</span>}
        </button>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-12">
        {/* BRAND SELECTOR */}
        <div className="max-w-md mx-auto mb-16 text-center">
          <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Choose Your Preference</h2>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full bg-white border-4 border-blue-900 flex items-center justify-between rounded-3xl px-8 py-5 text-lg font-black shadow-xl">
            <span className="text-blue-900 uppercase italic">{activeBrand}</span>
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
              <div className="h-32 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                 <FaWater className="text-4xl text-blue-300" />
              </div>
              <h3 className="font-black text-blue-900 text-sm uppercase mb-4">{item.product}</h3>
              <div className="mb-6 py-3 bg-blue-900 text-white rounded-xl font-black italic">₹{item.price}</div>
              <button 
                onClick={() => { setSelectedProductToAdd({ product: item, brand: activeBrand }); setQuantityToAdd(1); }}
                className="w-full bg-green-500 text-white font-black py-4 rounded-xl uppercase text-[10px]"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {/* OWNER CARD */}
        <div className="mt-32 max-w-4xl mx-auto bg-blue-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl">
          <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center text-blue-900 font-black italic">SME</div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black mb-2 uppercase italic">Seetha Mehesh Enterprises</h2>
            <p className="text-blue-300 font-bold uppercase text-[10px] mb-6">Official Logistics & Distribution Hub</p>
            <div className="flex gap-4">
               <a href="tel:+918792837678" className="bg-white text-blue-900 px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2"><FaPhoneAlt /> CALL</a>
               <a href="https://wa.me/918792837678" className="bg-green-500 px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2"><FaWhatsapp /> WHATSAPP</a>
            </div>
          </div>
        </div>

        {/* DYNAMIC GALLERY */}
        <section className="mt-32 mb-20">
          <h2 className="text-3xl font-black text-center text-blue-900 uppercase italic mb-12">Our Operations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {galleryItems.map((img) => (
              <div key={img.id} className="group relative h-64 overflow-hidden rounded-[2rem] shadow-lg">
                <img src={img.url} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" alt={img.title} />
                <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 flex items-end p-6 transition-opacity">
                  <span className="text-white font-black text-[10px] uppercase italic">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 py-12 text-center border-t">
          <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest">
            © 2026 Seetha Mehesh Enterprises • Tumakuru, Karnataka
          </p>
      </footer>

      {/* STYLE FOR MARQUEE */}
      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
      `}</style>
    </div>
  );
}