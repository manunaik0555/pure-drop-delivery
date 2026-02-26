"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FaBoxOpen, FaClipboardList, FaUsers, FaChartLine, 
  FaPlus, FaSignOutAlt, FaTimes, FaSave, FaArrowLeft, FaFileExcel, FaCog, FaTag, FaCheck 
} from "react-icons/fa";

const standardSizes = [
  "20L Water Can",
  "2L Case (9)",
  "1L Case (12)",
  "500ml Case (24)"
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  const [brands, setBrands] = useState(["Pure Drop", "Bisleri", "Kinley"]);
  const [liveTicker, setLiveTicker] = useState("✨ 24/7 Doorstep Delivery ✨ Bundle your orders and save! ✨ Managed by Gowtham Rathod ✨");
  const [newBrandName, setNewBrandName] = useState("");
  
  const [inventory, setInventory] = useState([
    { id: 1, brand: "Pure Drop", product: "20L Water Can", stock: 120, price: 40 },
    { id: 2, brand: "Bisleri", product: "1L Case (12)", stock: 45, price: 300 },
    { id: 3, brand: "Kinley", product: "500ml Case (24)", stock: 30, price: 220 },
  ]);

  const [orders, setOrders] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({ brand: brands[0], product: standardSizes[0], stock: 0, price: 0 });
  const [editingItem, setEditingItem] = useState<any>(null);

  // --- LOAD DATA ON STARTUP ---
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("pureDropOrders") || "[]");
    if (savedOrders.length > 0) setOrders(savedOrders);

    const savedInventory = JSON.parse(localStorage.getItem("pureDropInventory") || "[]");
    if (savedInventory.length > 0) {
      setInventory(savedInventory);
      const existingBrands = new Set(savedInventory.map((i: any) => i.brand));
      setBrands(Array.from(existingBrands) as string[]);
    } else {
      localStorage.setItem("pureDropInventory", JSON.stringify(inventory));
    }

    const savedTicker = localStorage.getItem("pureDropTicker");
    if (savedTicker) setLiveTicker(savedTicker);
  }, []);

  const downloadExcel = () => {
    const headers = "Order ID,Date,Customer,Items,Total Amount,Status\n";
    const csvData = orders.map(o => `${o.id},${o.date},${o.customer},${o.items},₹${o.total},${o.status}`).join("\n");
    const blob = new Blob([headers + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PureDrop_Orders_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBrandName && !brands.includes(newBrandName)) {
      setBrands([...brands, newBrandName]);
      setNewBrandName("");
      setIsBrandModalOpen(false);
      alert(`${newBrandName} added successfully!`);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv = [...inventory, { id: Date.now(), ...newItem }];
    setInventory(newInv);
    localStorage.setItem("pureDropInventory", JSON.stringify(newInv)); 
    setIsAddModalOpen(false);
  };

  const openEditModal = (item: any) => {
    setEditingItem({ ...item }); 
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv = inventory.map(item => item.id === editingItem.id ? editingItem : item);
    setInventory(newInv);
    localStorage.setItem("pureDropInventory", JSON.stringify(newInv)); 
    setIsEditModalOpen(false);
    setEditingItem(null); 
  };

  const handleUpdateTicker = () => {
    localStorage.setItem("pureDropTicker", liveTicker);
    alert("Live Notification updated successfully! Check the storefront.");
  };

  // --- NEW: UPDATE ORDER STATUS ---
  const handleToggleOrderStatus = (orderId: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        // Toggle between Pending and Delivered
        return { ...order, status: order.status === "Pending" ? "Delivered" : "Pending" };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    // Save the updated status back to the local storage bridge
    localStorage.setItem("pureDropOrders", JSON.stringify(updatedOrders));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-6 shadow-2xl z-10">
        <div className="mb-10 flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg text-blue-900 font-black uppercase">PD</div>
          <h1 className="font-black tracking-tighter text-xl italic uppercase">Admin</h1>
        </div>
        <nav className="flex-grow space-y-4">
          {[
            { name: "Overview", icon: <FaChartLine /> },
            { name: "Inventory", icon: <FaBoxOpen /> },
            { name: "Orders", icon: <FaClipboardList /> },
            { name: "Settings", icon: <FaCog /> }
          ].map((tab) => (
            <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.name ? "bg-blue-600 shadow-lg scale-105" : "text-blue-300 hover:bg-blue-800"}`}>
              {tab.icon} {tab.name}
            </button>
          ))}
        </nav>
        <Link href="/" className="mt-auto flex items-center gap-3 text-blue-300 hover:text-white font-black text-xs uppercase tracking-widest border-t border-blue-800 pt-6">
          <FaArrowLeft /> Exit Admin
        </Link>
      </aside>

      <main className="flex-grow p-10 h-screen overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black text-blue-900 tracking-tighter italic uppercase">{activeTab}</h2>
            <p className="text-slate-400 font-bold">Pure Drop Management System</p>
          </div>
        </header>

        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-blue-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Revenue</p>
              <h4 className="text-4xl font-black text-blue-900 italic">₹{orders.reduce((sum, o) => sum + o.total, 0)}</h4>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-blue-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Orders</p>
              <h4 className="text-4xl font-black text-blue-900 italic">{orders.length}</h4>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-blue-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Brands in Stock</p>
              <h4 className="text-4xl font-black text-blue-900 italic">{brands.length}</h4>
            </div>
          </div>
        )}

        {activeTab === "Inventory" && (
          <div className="bg-white rounded-[3rem] shadow-xl border border-blue-50 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-blue-50/30">
              <h3 className="font-black text-2xl text-blue-900 uppercase italic tracking-tighter">Stock Management</h3>
              <div className="flex gap-4">
                <button onClick={() => setIsBrandModalOpen(true)} className="bg-white border-2 border-blue-100 text-blue-600 px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 uppercase tracking-widest hover:bg-blue-50 transition-all">
                  <FaTag /> New Brand
                </button>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all">
                  <FaPlus /> Add Stock
                </button>
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-5">Brand</th>
                  <th className="px-10 py-5">Product Size</th>
                  <th className="px-10 py-5">Stock</th>
                  <th className="px-10 py-5">Price</th>
                  <th className="px-10 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-10 py-6 font-black text-blue-600 uppercase text-xs">{item.brand}</td>
                    <td className="px-10 py-6 font-bold text-slate-700">{item.product}</td>
                    <td className="px-10 py-6 font-black">{item.stock} Units</td>
                    <td className="px-10 py-6 font-black text-blue-900 text-lg">₹{item.price}</td>
                    <td className="px-10 py-6 text-center">
                      <button onClick={() => openEditModal(item)} className="text-blue-500 font-black text-[10px] uppercase hover:underline">
                        Edit Item
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- UPDATED ORDERS TAB --- */}
        {activeTab === "Orders" && (
          <div className="bg-white rounded-[3rem] shadow-xl border border-blue-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
            <div className="p-8 border-b border-slate-50 bg-blue-50/30 flex justify-between items-center">
              <h3 className="font-black text-2xl text-blue-900 uppercase italic tracking-tighter">Incoming Orders</h3>
              <button onClick={downloadExcel} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 uppercase tracking-widest shadow-lg transition-all">
                <FaFileExcel size={16} /> Download Excel
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-10 py-5">Order ID</th>
                  <th className="px-10 py-5">Date</th>
                  <th className="px-10 py-5">Customer</th>
                  <th className="px-10 py-5">Items</th>
                  <th className="px-10 py-5">Status</th>
                  <th className="px-10 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-10 py-6 font-black text-blue-600 text-xs">{order.id}</td>
                    <td className="px-10 py-6 font-bold text-slate-500 text-xs">{order.date}</td>
                    <td className="px-10 py-6 font-bold text-slate-700">{order.customer}</td>
                    <td className="px-10 py-6 font-medium text-slate-500 italic text-sm">{order.items}</td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === "Delivered" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-center">
                      {order.status === "Pending" ? (
                        <button 
                          onClick={() => handleToggleOrderStatus(order.id)}
                          className="bg-green-500 hover:bg-green-600 text-white font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded-xl shadow-md transition-all"
                        >
                          Mark Delivered
                        </button>
                      ) : (
                        <span className="text-slate-300 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1">
                          <FaCheck /> Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Settings" && (
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-blue-50 animate-in zoom-in duration-500 max-w-3xl">
            <h3 className="font-black text-2xl text-blue-900 uppercase italic tracking-tighter mb-8">Storefront Settings</h3>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Offer / Notification Ticker</label>
              <textarea value={liveTicker} onChange={(e) => setLiveTicker(e.target.value)} rows={3} className="w-full border-4 border-slate-50 bg-slate-50 p-6 rounded-2xl font-bold text-blue-900 focus:border-blue-500 focus:bg-white outline-none transition-all leading-relaxed"></textarea>
              <button onClick={handleUpdateTicker} className="bg-blue-600 text-white font-black py-4 px-8 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 uppercase tracking-widest text-xs flex items-center gap-3 mt-4">
                <FaSave /> Update Live Store
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-md flex items-center justify-center p-4 z-[200]">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 relative">
            <button onClick={() => setIsBrandModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500"><FaTimes size={24}/></button>
            <h3 className="text-3xl font-black text-blue-900 mb-6 uppercase italic tracking-tighter">Add Brand</h3>
            <form onSubmit={handleAddBrand} className="space-y-4">
              <input required type="text" placeholder="e.g. Aquafina" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} className="w-full border-4 border-slate-50 bg-slate-50 p-5 rounded-2xl font-black focus:border-blue-500 outline-none" />
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest"><FaSave className="inline mr-2"/> Save Brand</button>
            </form>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-md flex items-center justify-center p-4 z-[200]">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500"><FaTimes size={24}/></button>
            <h3 className="text-3xl font-black text-blue-900 mb-6 uppercase italic tracking-tighter">Add Stock</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Select Brand</label>
                <select required className="w-full border-4 border-slate-50 bg-slate-50 p-5 rounded-2xl font-black outline-none focus:border-blue-500" onChange={(e) => setNewItem({...newItem, brand: e.target.value})}>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Select Size</label>
                <select required className="w-full border-4 border-slate-50 bg-slate-50 p-5 rounded-2xl font-black focus:border-blue-500 outline-none" onChange={(e) => setNewItem({...newItem, product: e.target.value})}>
                  {standardSizes.map(size => <option key={size} value={size}>{size}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Quantity</label>
                  <input required type="number" placeholder="0" className="w-full border-4 border-slate-50 bg-slate-50 p-5 rounded-2xl font-black focus:border-blue-500 outline-none" onChange={(e) => setNewItem({...newItem, stock: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Price (₹)</label>
                  <input required type="number" placeholder="₹" className="w-full border-4 border-slate-50 bg-slate-50 p-5 rounded-2xl font-black focus:border-blue-500 outline-none" onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest mt-4"><FaSave className="inline mr-2"/> Add Item</button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-blue-950/60 backdrop-blur-md flex items-center justify-center p-4 z-[200]">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md p-10 relative">
            <button onClick={() => { setIsEditModalOpen(false); setEditingItem(null); }} className="absolute top-8 right-8 text-slate-300 hover:text-red-500"><FaTimes size={24}/></button>
            <h3 className="text-3xl font-black text-blue-900 mb-6 uppercase italic tracking-tighter">Edit Inventory</h3>
            
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Brand</label>
                  <select value={editingItem.brand} onChange={(e) => setEditingItem({...editingItem, brand: e.target.value})} className="w-full border-4 border-slate-50 bg-slate-50 p-4 rounded-2xl font-black focus:border-blue-500 outline-none">
                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Product Size</label>
                  <select value={editingItem.product} onChange={(e) => setEditingItem({...editingItem, product: e.target.value})} className="w-full border-4 border-slate-50 bg-slate-50 p-4 rounded-2xl font-black focus:border-blue-500 outline-none">
                    {standardSizes.map(size => <option key={size} value={size}>{size}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Stock</label>
                  <input required type="number" value={editingItem.stock} className="w-full border-4 border-slate-50 bg-slate-50 p-5 rounded-2xl font-black focus:border-blue-500 outline-none" onChange={(e) => setEditingItem({...editingItem, stock: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Price (₹)</label>
                  <input required type="number" value={editingItem.price} className="w-full border-4 border-slate-50 bg-slate-50 p-5 rounded-2xl font-black focus:border-blue-500 text-blue-900 outline-none" onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})} />
                </div>
              </div>

              <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest mt-6 shadow-xl shadow-green-100 transition-all">
                <FaSave className="inline mr-2"/> Update Data
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}