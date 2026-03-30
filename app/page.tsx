"use client";

import { useState } from "react";
import { 
  FaWhatsapp, FaPhoneAlt, FaWater, FaMapMarkerAlt, FaTruck, FaUserTie, 
  FaImage, FaEnvelope, FaAward
} from "react-icons/fa";

// --- 1. UPLOAD YOUR OWNER PICTURE HERE ---
const OWNER_IMAGE_URL = ""; 

// --- 2. UPDATE YOUR GALLERY PICTURES HERE ---
const GALLERY_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1550041403-59648937061d?q=80&w=2070", title: "Bulk Loading" },
  { id: 2, url: "https://images.unsplash.com/photo-1523362622602-4c7401066230?q=80&w=2071", title: "Event Supply" },
  { id: 3, url: "https://images.unsplash.com/photo-1563203369-26f2e4a5ccf7?q=80&w=2070", title: "Quality Check" },
  { id: 4, url: "https://images.unsplash.com/photo-1548919973-5cdf5916ad52?q=80&w=2070", title: "Pure Delivery" },
];

export default function Home() {
  const handleInquiry = (subject: string) => {
    const msg = `*OFFICIAL INQUIRY: SEETHA MAHESH ENTERPRISES*%0A%0A*SERVICE:* ${subject}%0A*LOCATION:* Sira%0A%0A*Professional inquiry for event water supply.*`;
    window.open(`https://wa.me/916363273658?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#050810] text-[#f0f4ff] font-sans">
      
      {/* ELITE CONTACT BAR */}
      <div className="bg-white py-2 px-6 border-b flex justify-center md:justify-end gap-10 items-center shadow-sm">
        <div className="flex items-center gap-2 text-[#1a2235] font-bold text-xs tracking-tight">
          <FaPhoneAlt className="text-blue-600" size={12} />
          <span>+91 6363273658</span>
        </div>
        <div className="flex items-center gap-2 text-[#1a2235] font-bold text-xs tracking-tight">
          <FaEnvelope className="text-blue-600" size={14} />
          <span>seethamaheshsira@gmail.com</span>
        </div>
      </div>

      {/* LUXURY NAV */}
      <nav className="sticky top-0 z-50 bg-[#050810]/80 backdrop-blur-2xl border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
            <FaWater className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-widest leading-none uppercase italic text-white">SEETHA MAHESH</h1>
            <p className="text-[8px] tracking-[0.4em] text-blue-400 font-black uppercase mt-1">Logistics · Sira</p>
          </div>
        </div>
        <button onClick={() => handleInquiry("General")} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-black text-[10px] tracking-widest transition-all shadow-lg active:scale-95">
          BOOK NOW
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative px-6 pt-24 pb-16 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -z-10" />
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[9px] font-black tracking-widest text-blue-400 uppercase mb-8">
          <FaAward className="text-yellow-500" /> Premium Function Supplier · Sira
        </div>
        <h2 className="text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8 italic uppercase text-white">
          ಗೋಲ್ಡ್ ಸ್ಟ್ಯಾಂಡರ್ಡ್
ಶುದ್ಧತೆ <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400"></span>
        </h2>
        <p className="text-[#8fa3c0] text-lg max-w-xl mx-auto mb-12 leading-relaxed">
          ಸಿರಾದಾದ್ಯಂತ ಗ್ರ್ಯಾಂಡ್ ಫಂಕ್ಷನ್‌ಗಳು ಮತ್ತು ಕಾರ್ಪೊರೇಟ್ ಈವೆಂಟ್‌ಗಳಿಗೆ ಪ್ರೀಮಿಯಂ ವಾಟರ್ ಕೇಸ್ ವಿತರಣೆ.
        </p>
      </section>

      {/* PRODUCT GRID */}
      <section className="px-8 py-20 bg-[#080c16]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Half Liter", "1 Liter", "2 Liter"].map((size) => (
            <div key={size} className="bg-[#111827] border border-white/5 rounded-[2.5rem] p-8 text-center hover:border-blue-500/30 transition-all shadow-xl">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">💧</div>
              <h4 className="text-xl font-black text-white uppercase italic mb-2">{size} Case</h4>
              <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8">Event Inventory</p>
              <button onClick={() => handleInquiry(size)} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all">
                REQUEST QUOTE
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* OWNER PROFILE */}
      <section className="px-8 py-20 bg-[#050810]">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#111827] to-[#0a0f1e] border border-white/10 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
          <div className="w-40 h-40 bg-[#1e3050] rounded-full flex items-center justify-center text-white overflow-hidden border-4 border-blue-600 relative">
             {OWNER_IMAGE_URL ? (
               <img src={OWNER_IMAGE_URL} alt="/owner.jpeg " className="w-full h-full object-cover" />
             ) : (
               <FaUserTie size={60} className="opacity-50" />
             )}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black mb-1 uppercase italic tracking-tighter text-white">Gowtham Rathod</h2>
            <p className="text-blue-400 font-bold uppercase text-xs mb-8 tracking-widest">Lead Distributor</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <a href="tel:+916363273658" className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-blue-50 transition-all uppercase italic tracking-widest"><FaPhoneAlt /> CALL DIRECT</a>
               <a href="https://wa.me/916363273658" className="bg-[#25d366] text-white px-8 py-3 rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-[#1db954] transition-all uppercase italic tracking-widest"><FaWhatsapp /> WHATSAPP</a>
            </div>
          </div>
        </div>
      </section>

      {/* COMPACT MAP SECTION */}
      <section className="px-8 py-16 bg-[#080c16]">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h3 className="text-2xl font-black italic uppercase tracking-widest text-white mb-2">LOCATION</h3>
          <p className="text-[#4a6080] text-[9px] font-black uppercase tracking-widest">Main Road · Sira · Karnataka</p>
        </div>
        <div className="max-w-3xl mx-auto h-[300px] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15494.383794692723!2d76.89518055458021!3d13.74281358928312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb0e0a5c0b567d1%3A0x6734c760b73467d1!2sSira%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1711776000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* GALLERY SECTION (NOW BELOW MAP & COMPACT) */}
      <section className="px-8 py-20 bg-[#050810]">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h3 className="text-2xl font-black italic uppercase tracking-widest text-white mb-2">VIEW OUR GALLERY</h3>
          <p className="text-[#4a6080] text-[9px] font-black uppercase tracking-[0.4em]">Operations & Fleet Highlights</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {GALLERY_IMAGES.map((img) => (
            <div key={img.id} className="relative h-44 rounded-[1.5rem] overflow-hidden border border-white/5 shadow-xl">
              <img src={img.url} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt={img.title} />
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050810] py-16 text-center border-t border-white/5">
          <p className="text-[#4a6080] font-black text-[9px] uppercase tracking-[0.5em]">
            © 2026 Seetha Mahesh Enterprises · Sira
          </p>
      </footer>
    </div>
  );
}