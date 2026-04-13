"use client";

import React, { useState, useMemo } from 'react';
import {
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Diamond,
  Shirt,
  Sparkles,
  Globe,
  Share2,
  Filter,
  ArrowUpRight,
  ShoppingCart
} from 'lucide-react';


export default function ShopCartPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const allProducts = {
    1: [
      {
        id: 1,
        name: "Sony WH-1000XM5 Wireless Headphones",
        price: 399,
        category: "Audio",
        img: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=813&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        tag: "Newest",
        desc: "Premium noise-cancelling wireless headphones with crystal clear sound and long battery life."
      },
      {
        id: 2,
        name: "iPhone 15 Pro",
        price: 999,
        category: "Smartphone",
        img: "https://images.unsplash.com/photo-1592832122594-c0c6bad718b1?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        tag: "Limited",
        desc: "Premium flagship phone with powerful performance, S Pen support, and pro-grade camera."
      },
      {
        id: 3,
        name: "Apple Watch Series 9",
        price: 399,
        category: "Smartwatch",
        img: "https://images.unsplash.com/photo-1624096104992-9b4fa3a279dd?q=80&w=402&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        desc: "Advanced smartwatch with fitness tracking, health monitoring, and seamless iPhone integration."
      },
      {
        id: 4,
        name: "Samsung Galaxy A54",
        price: 450,
        category: "Smartphone",
        img: "https://images.unsplash.com/photo-1609252924198-30b8cb324d2b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        tag: "Featured",
        desc: "Mid-range smartphone with solid performance, vibrant display, and long battery life."
      },
      {
        id: 5,
        name: "Dell XPS 13",
        price: 999,
        category: "Laptop",
        img: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        desc: "Ultra-thin laptop with powerful performance, InfinityEdge display, and premium build quality."
      },
      {
        id: 6,
        name: "iPhone 15",
        price: 799,
        category: "Smartphone",
        img: "https://images.unsplash.com/photo-1736173155811-e8142fd553ee?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        tag: "Luxury",
        desc: "Powerful and sleek smartphone with improved battery life and high-quality camera."
      },
    ],
    2: [
      {
        id: 7,
        name: "HP Pavilion 15",
        price: 650,
        category: "Laptop",
        img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        tag: "Newest",
        desc: "Reliable everyday laptop with smooth performance, ideal for students and office work."
      },
      {
        id: 8,
        name: "Samsung Galaxy S24 Ultra",
        price: 1199,
        category: "Smartphone",
        img: "https://images.unsplash.com/photo-1706372124839-f35d821ccd24?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        tag: "Premium",
        desc: "Premium flagship phone with powerful performance, S Pen support, and pro-grade camera."
      },
      {
        id: 9,
        name: "JBL Tune 760NCt",
        price: 120,
        category: "Audio",
        img: "https://plus.unsplash.com/premium_photo-1679513691641-9aedddc94f96?q=80&w=813&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        desc: "Lightweight wireless headphones with active noise cancellation and deep bass performance."
      },
      {
        id: 10,
        name: "Samsung Galaxy Watch 6",
        price: 299,
        category: "Smartwatch",
        img: "https://images.unsplash.com/photo-1680113727062-8a118574b782?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        tag: "Newest",
        desc: "Stylish smartwatch with health tracking, AMOLED display, and long battery performance."
      },
      {
        id: 11,
        name: "MacBook Air M2",
        price: 1099,
        category: "Laptop",
        img: "https://images.unsplash.com/photo-1651241680016-cc9e407e7dc3?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        tag: "Premium",
        desc: "Lightweight Apple laptop powered by M2 chip, offering fast performance and all-day battery life."
      },
      {
        id: 12,
        name: "Apple AirPods Pro",
        price: 249,
        category: "Audio",
        img: "https://images.unsplash.com/photo-1659943063471-2fcc8b45edd2?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        desc: "Wireless earbuds with active noise cancellation, transparency mode, and immersive sound quality."
      },
    ],
    3: []
  };

  const currentItems = allProducts[currentPage] || [];

  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] flex flex-col font-sans antialiased overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-[100] px-6 md:px-16 py-6">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-[28px] font-bold text-[#4F46E5] tracking-tight">
                ShopCart
              </span>
            </div>
          </div>

          <ul className="hidden lg:flex items-center space-x-12">
            {['Discover', 'Atelier', 'Collections'].map((link) => (
              <li key={link} className="relative group cursor-pointer">
                <span className={`text-[13px] font-bold ${link === 'Discover' ? 'text-[#4F46E5]' : 'text-gray-300'} group-hover:text-[#4F46E5] transition-colors`}>
                  {link}
                </span>
                {link === 'Discover' && <div className="absolute -bottom-[32px] left-0 w-full h-[3px] bg-[#4F46E5] rounded-t-full"></div>}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-8">
            <div className="relative hidden xl:flex items-center group">
              <input
                type="text"
                placeholder="Search curated pieces..."
                required=""
                className="w-[380px] bg-[#F8F9FE] py-3.5 px-8 rounded-2xl text-[13px] outline-none font-semibold text-[#1A1A1A] border border-transparent focus:bg-white focus:border-indigo-100 transition-all duration-300 shadow-sm placeholder:text-gray-400"
              />
              <div className="absolute right-4 p-2 bg-white rounded-xl shadow-sm group-focus-within:bg-[#4F46E5] transition-all duration-300 cursor-pointer">
                <Search size={14} className="text-gray-400 group-focus-within:text-white" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="p-3 bg-[#F8F9FE] rounded-full cursor-pointer hover:bg-gray-100 transition-all">
                <ShoppingCart size={20} className="text-gray-800" />
              </div>
              <div className="p-3 bg-[#F8F9FE] rounded-full cursor-pointer hover:bg-gray-100 transition-all">
                <User size={20} className="text-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* SIDEBAR */}
      <div className="w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row flex-grow">

        <aside className="w-full lg:w-[350px] p-8 md:p-12 border-r border-gray-50 flex flex-col gap-16">

          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-[3px] text-gray-300">Collections</h3>
              <Filter size={14} className="text-gray-300" />
            </div>
            <nav className="flex flex-col gap-2">
              {[
                { name: 'All Collections', icon: <LayoutGrid size={18} /> },
                { name: 'Jewelry', icon: <Diamond size={18} /> },
                { name: 'Atelier Wear', icon: <Shirt size={18} /> }
              ].map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center w-full px-6 py-4.5 rounded-[22px] font-bold text-[14px] transition-all duration-300 ${activeCategory.includes(cat.name.split(' ')[0]) ? 'bg-[#E0E2F7] text-[#4F46E5] shadow-sm' : 'text-gray-400 hover:bg-gray-50'}`}
                >
                  <span className="mr-4 opacity-70">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-8">
            <h3 className="text-[11px] font-black uppercase tracking-[3px] text-gray-300">Price Threshold</h3>
            <div className="px-2">
              <div className="h-[4px] w-full bg-gray-100 rounded-full relative">
                <div className="absolute left-0 top-0 h-full bg-[#4F46E5] w-[70%] rounded-full"></div>
                <div className="absolute left-[70%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-[#4F46E5] rounded-full shadow-md cursor-pointer"></div>
              </div>
              <div className="flex justify-between mt-6">
                <span className="text-[12px] font-black text-gray-400">$0</span>
                <span className="text-[12px] font-black text-[#12121A]">$5,000+</span>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-10">
            <button className="group relative w-full bg-[#4F46E5] p-1 rounded-[24px] overflow-hidden shadow-xl shadow-indigo-100 hover:shadow-indigo-200 transition-all">
              <div className="bg-[#4F46E5] px-8 py-5 rounded-[22px] flex items-center justify-center gap-3 text-white font-black text-[13px] uppercase tracking-wider group-hover:bg-[#3F37C9] transition-colors">
                <Sparkles size={18} fill="white" className="animate-pulse" />
                AI Curator
              </div>
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8 md:p-16 lg:p-24 bg-white">
          <header className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <div className="max-w-2xl">
              <h1 className="text-[44px] font-bold tracking-tight text-[#1A1A1A] leading-tight mb-4">
                Seasonal Curations
              </h1>
              <p className="text-gray-500 text-[15px] font-medium max-w-lg leading-relaxed">
                Explore our latest atelier arrivals, where every piece is selected for its architectural integrity and soulful craftsmanship.
              </p>
            </div>

            <div className="flex bg-[#F6F6FF] p-1.5 rounded-[14px] items-center">
              <button className="px-7 py-2.5 bg-white text-[#4F46E5] rounded-[10px] font-bold text-[13px] shadow-sm transition-all">
                Popular
              </button>

              <button className="px-7 py-2.5 text-gray-500 hover:text-[#4F46E5] font-bold text-[13px] transition-all">
                Newest
              </button>

              <button className="px-7 py-2.5 text-gray-500 hover:text-[#4F46E5] font-bold text-[13px] transition-all">
                Price
              </button>
            </div>
          </header>

          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-28">
              {currentItems.map((item) => (
                <article key={item.id} className="group flex flex-col">
                  <div className="relative aspect-[4/5] bg-[#F8FAFC] rounded-[45px] overflow-hidden mb-10 shadow-sm transition-all duration-700 hover:shadow-2xl hover:shadow-gray-200">
                    {item.tag && (
                      <div className="absolute top-10 left-10 z-20">
                        <span className="bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[2px] text-[#4F46E5] shadow-sm">
                          {item.tag}
                        </span>
                      </div>
                    )}

                    <img
                      src={item.img}
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                      alt={item.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="flex flex-col px-4 gap-3">

                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[22px] font-black text-[#12121A] group-hover:text-[#4F46E5] transition-colors duration-300">
                          {item.name}
                        </h3>

                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-black text-gray-300 uppercase tracking-[2px]">
                            {item.category}
                          </span>
                          <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                          <span className="text-[11px] font-bold text-gray-300">
                            In Stock
                          </span>
                        </div>
                      </div>

                      <ArrowUpRight size={16} className="text-gray-200 mt-1" />
                    </div>

                    <span className="text-[24px] font-black text-[#3f37c9]">
                      ${item.price}
                    </span>

                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center border-4 border-dashed border-gray-50 rounded-[60px] text-center p-20 bg-gray-50/30">
              <div className="w-24 h-24 bg-white rounded-[30px] shadow-xl flex items-center justify-center mb-10">
                <Search size={40} className="text-gray-200" />
              </div>
              <h2 className="text-4xl font-black text-[#12121A] mb-4">No Products Found</h2>
              <p className="text-gray-400 max-w-sm font-medium leading-relaxed mb-12">
                We're currently updating this section with new architectural finds. Please check back shortly.
              </p>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-12 py-5 bg-[#4F46E5] text-white rounded-full font-black text-[13px] uppercase tracking-widest hover:shadow-2xl transition-all active:scale-95"
              >
                Return Home
              </button>
            </div>
          )}

          <div className="mt-40 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-sm hover:border-indigo-100 hover:text-[#4F46E5] transition-all disabled:opacity-20"
            >
              <ChevronLeft size={24} />
            </button>
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-16 h-16 rounded-full font-black text-[16px] border transition-all duration-500 ${currentPage === num ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-2xl shadow-indigo-200' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(3, p + 1))}
              className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center bg-white shadow-sm hover:border-indigo-100 hover:text-[#4F46E5] transition-all disabled:opacity-20"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </main>
      </div>


      {/* FOOTER */}

      <footer className="bg-[#12121A] text-white pt-32 pb-16 px-8 md:px-20 w-full">
        <div className="max-w-[1500px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">

            <div className="flex flex-col gap-10">
              <div className="flex items-center">
                <span className="text-[28px] font-bold text-[#ffffff] tracking-tight">
                  ShopCart Atelier
                </span>
              </div>
              <p className="text-gray-500 text-[15px] leading-relaxed font-medium">
                Designing the future of digital commerce through intentional curation and aesthetic integrity.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 transition-transform cursor-pointer shadow-xl"><Globe size={20} /></div>
                <div className="w-12 h-12 rounded-full bg-[#1F1F29] flex items-center justify-center text-gray-400 hover:bg-gray-700 transition-all cursor-pointer"><Share2 size={20} /></div>
              </div>
            </div>

            <div>
              <h4 className="font-black text-[11px] uppercase tracking-[4px] text-white/30 mb-10">Collections</h4>
              <ul className="flex flex-col gap-5 text-gray-500 font-bold text-[14px]">
                {['The Modernist', 'Brutalist Edge', 'Soft Minimal', 'Organic Forms'].map(item => (
                  <li key={item} className="hover:text-white hover:translate-x-2 transition-all cursor-pointer">{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-black text-[11px] uppercase tracking-[4px] text-white/30 mb-10">Information</h4>
              <ul className="flex flex-col gap-5 text-gray-500 font-bold text-[14px]">
                {['Sustainability', 'Shipping Policy', 'Returns & Exchanges', 'Our Story'].map(item => (
                  <li key={item} className="hover:text-white hover:translate-x-2 transition-all cursor-pointer">{item}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-8">
              <h4 className="font-black text-[11px] uppercase tracking-[4px] text-white/30">Stay Connected</h4>
              <p className="text-gray-500 text-[14px] font-medium leading-relaxed">
                Join our newsletter for early access to seasonal drops and atelier reports.
              </p>

              <div className="flex flex-col gap-3 bg-white p-2 rounded-[26px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Email Address"
                  className="bg-transparent text-black px-6 py-4 text-[14px] outline-none font-bold placeholder:text-gray-400"
                />

                <button
                  onClick={() => {
                    if (email.trim() === '') {
                      setError('Email is required');
                      return;
                    }

                    if (!email.includes('@')) {
                      setError('Email must contain @');
                      return;
                    }

                    setError('');
                    setEmail('');
                  }}
                  className="bg-[#4F46E5] text-white py-4 rounded-[20px] font-black text-[11px] uppercase tracking-[3px] hover:bg-[#3F37C9] transition-all"
                >
                  Join
                </button>

                {error && (
                  <p className="text-red-500 text-xs px-4">
                    {error}
                  </p>
                )}
              </div>

            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[11px] font-bold text-gray-600 uppercase tracking-[3px]">
              © 2024 ShopCart Atelier. All rights reserved.
            </p>
            <div className="flex gap-12 text-[11px] font-bold text-gray-600 uppercase tracking-[3px]">
              <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}