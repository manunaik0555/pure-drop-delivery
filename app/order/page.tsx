"use client";

import { useState } from "react";
import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaPhoneAlt, FaEnvelope, FaTimes, FaCheckCircle } from "react-icons/fa";

export default function Home() {
  const liveOffer = "🎉 SPECIAL OFFER: Get your first 20L can delivery FREE with a new monthly subscription! 🎉";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ name: "", price: 0 });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: 1 // Default to 1
  });

  const handleOrderClick = (productName: string, productPrice: number) => {
    setSelectedProduct({ name: productName, price: productPrice });
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      // If it is the quantity field, make sure it stays a number for our price calculation
      [name]: name === "quantity" ? (value === "" ? "" : Number(value)) : value 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order placed:", { product: selectedProduct.name, ...formData });
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-blue-50 relative">
      
      {/* --- LIVE OFFER BANNER --- */}
      <div className="bg-yellow-400 text-blue-900 py-2 text-center font-bold px-4 shadow-sm text-sm sm:text-base">
        <p>{liveOffer}</p>
      </div>

      {/* --- TOP NAVIGATION BAR --- */}
      <header className="bg-white shadow-md py-4 px-4 sm:px-8 flex items-center justify-between">
        <Link href="/dashboard" className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors text-sm border border-gray-200 shadow-sm flex items-center gap-2">
          ⚙️ <span className="hidden sm:inline">Admin</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 text-center flex-grow">
          Pure Drop Water
        </h1>
        <div className="w-[85px] hidden sm:block"></div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto p-6 flex flex-col items-center pb-20 mt-4">

        {/* --- OUR PRODUCTS SECTION --- */}
        <section className="w-full max-w-5xl mb-16">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 500ml */}
            <div className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center text-center border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-full h-48 bg-blue-100 rounded-2xl mb-6 flex items-center justify-center text-blue-400 text-lg font-semibold">[ 500ml Bottles Image ]</div>
              <h3 className="text-2xl font-bold text-blue-800 mb-2">500ml Bottles (Case of 24)</h3>
              <p className="text-gray-600 mb-4 flex-grow">Perfect for large gatherings and quick hydration on the go.</p>
              <p className="text-3xl font-extrabold text-blue-600 mb-6">₹180 <span className="text-lg font-normal text-gray-500">/ case</span></p>
              <button onClick={() => handleOrderClick("500ml Bottles (Case of 24)", 180)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                Order Now
              </button>
            </div>

            {/* 1L */}
            <div className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center text-center border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-full h-48 bg-blue-100 rounded-2xl mb-6 flex items-center justify-center text-blue-400 text-lg font-semibold">[ 1L Bottles Image ]</div>
              <h3 className="text-2xl font-bold text-blue-800 mb-2">1L Bottles (Case of 12)</h3>
              <p className="text-gray-600 mb-4 flex-grow">Convenient for events, travel, or personal daily use.</p>
              <p className="text-3xl font-extrabold text-blue-600 mb-6">₹240 <span className="text-lg font-normal text-gray-500">/ case</span></p>
              <button onClick={() => handleOrderClick("1L Bottles (Case of 12)", 240)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                Order Now
              </button>
            </div>

            {/* 2L */}
            <div className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center text-center border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-full h-48 bg-blue-100 rounded-2xl mb-6 flex items-center justify-center text-blue-400 text-lg font-semibold">[ 2L Bottles Image ]</div>
              <h3 className="text-2xl font-bold text-blue-800 mb-2">2L Bottles (Case of 9)</h3>
              <p className="text-gray-600 mb-4 flex-grow">Great for family trips, road travel, and extended outdoor activities.</p>
              <p className="text-3xl font-extrabold text-blue-600 mb-6">₹270 <span className="text-lg font-normal text-gray-500">/ case</span></p>
              <button onClick={() => handleOrderClick("2L Bottles (Case of 9)", 270)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                Order Now
              </button>
            </div>

            {/* 20L */}
            <div className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center text-center border border-blue-100 hover:shadow-xl transition-shadow">
              <div className="w-full h-48 bg-blue-100 rounded-2xl mb-6 flex items-center justify-center text-blue-400 text-lg font-semibold">[ 20L Can Image ]</div>
              <h3 className="text-2xl font-bold text-blue-800 mb-2">20L Water Can</h3>
              <p className="text-gray-600 mb-4 flex-grow">Perfect for households and offices. Economical, pure, and long-lasting.</p>
              <p className="text-3xl font-extrabold text-blue-600 mb-6">₹40 <span className="text-lg font-normal text-gray-500">/ can</span></p>
              <button onClick={() => handleOrderClick("20L Water Can", 40)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
                Order Now
              </button>
            </div>

          </div>
        </section>

        {/* --- OWNER CONTACT CARD --- */}
        <section className="w-full max-w-3xl">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8 border-t-4 border-blue-500">
            <div className="w-40 h-40 bg-gray-200 rounded-full flex-shrink-0 border-4 border-white shadow-lg flex items-center justify-center text-gray-500 font-semibold overflow-hidden">Photo</div>
            <div className="text-center md:text-left flex-grow w-full">
              <h3 className="text-3xl font-bold text-blue-900 mb-1">Gowtham Rathod</h3>
              <p className="text-blue-600 font-medium text-lg mb-6">Owner & Distributor</p>
              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-700 bg-blue-50 py-3 px-4 rounded-xl">
                  <FaPhoneAlt className="text-blue-500 text-xl" />
                  <a href="tel:+918782837678" className="hover:text-blue-600 transition-colors text-lg font-semibold">+91 8782837678</a>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-700 bg-blue-50 py-3 px-4 rounded-xl">
                  <FaEnvelope className="text-blue-500 text-xl" />
                  <a href="mailto:manunaik0555@gmail.com" className="hover:text-blue-600 transition-colors font-semibold">manunaik0555@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ========================================= */}
      {/* --- ORDER POP-UP MODAL OVERLAY --- */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-2">
              <FaTimes size={24} />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-blue-900 mb-2">Order Confirmed!</h3>
                <p className="text-gray-600 mb-6">Thank you. We will deliver your {selectedProduct.name} shortly.</p>
                <button onClick={() => setIsModalOpen(false)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl">Close</button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-blue-900 mb-1">Quick Order</h3>
                <p className="text-gray-600 mb-6 font-medium border-b pb-4">
                  {selectedProduct.name} - ₹{selectedProduct.price}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Quantity</label>
                    <input 
                      required 
                      type="number" 
                      min="1" 
                      name="quantity" 
                      value={formData.quantity} 
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        // This strictly prevents users from typing 'e', '.', '+', or '-'
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Mobile number" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Address</label>
                    <textarea required name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Full address"></textarea>
                  </div>
                  
                  {/* Total Price Display */}
                  <div className="pt-2 text-right text-lg font-bold text-blue-900">
                    {/* Multiply safely and fallback to 0 if quantity is accidentally empty */}
                    Total: ₹{selectedProduct.price * (Number(formData.quantity) || 0)}
                  </div>

                  <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors text-lg shadow-md mt-2">
                    Confirm Order
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}