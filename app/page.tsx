"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });

const products = [
  {
    id: "SHOE001",
    name: "Air Runner Pro",
    price: 120,
    description:
      "Lightweight performance running shoe with responsive cushioning and breathable mesh upper. Perfect for daily training.",
  },
  {
    id: "SHOE002",
    name: "Classic Oxford",
    price: 89,
    description:
      "Timeless leather Oxford with premium full-grain upper and cushioned insole. Goes from office to weekend effortlessly.",
  },
  {
    id: "SHOE003",
    name: "Trail Blazer",
    price: 145,
    description:
      "Rugged trail shoe with aggressive outsole grip and waterproof protection. Built for the toughest terrain.",
  },
];

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-gray-900">
            👟 SneakerHub — Premium Footwear
          </span>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Orders
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Support
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          New Arrivals
        </h2>
        <p className="text-gray-500 mb-8 text-sm">
          Free shipping on orders over $100
        </p>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Image placeholder */}
              <div className="bg-gray-100 h-52 flex items-center justify-center text-5xl select-none">
                👟
              </div>

              {/* Card body */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-base">
                    {product.name}
                  </h3>
                  <span className="text-base font-bold text-gray-900 ml-2 whitespace-nowrap">
                    ${product.price}
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex-1 leading-relaxed">
                  {product.description}
                </p>
                <button className="mt-4 w-full bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating chat button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-30 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-3 rounded-full shadow-lg transition-colors flex items-center gap-2"
        >
          💬 Support
        </button>
      )}

      {/* Chatbot panel */}
      {chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
    </div>
  );
}
