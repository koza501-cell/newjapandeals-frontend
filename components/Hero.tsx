'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const headlines = [
  {
    title: "Tired of Proxy Fees Eating Your Budget?",
    subtitle: "Save 20-40% buying direct from Japan"
  },
  {
    title: "Why Pay 40% Extra to a Middleman?",
    subtitle: "Skip the proxy services and hidden fees"
  },
  {
    title: "Direct from Japan. No Proxy. No Surprises.",
    subtitle: "One price. One payment. Ships in 48 hours."
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % headlines.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Red Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B50012] to-transparent" />

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="text-2xl">🇯🇵</span>
            <span className="text-sm font-medium">Trusted Japanese Dealer Since 2014</span>
          </div>

          {/* Rotating Headlines */}
          <div className="min-h-[180px] md:min-h-[150px] flex flex-col justify-center">
            <h1 
              className={`text-4xl md:text-6xl font-bold mb-4 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {headlines[currentIndex].title}
            </h1>
            <p 
              className={`text-xl md:text-2xl text-gray-300 transition-all duration-500 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {headlines[currentIndex].subtitle}
            </p>
          </div>

          {/* Main CTA */}
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Buy authentic Japanese watches directly from a 10-year trusted dealer. 
            <span className="text-[#C9A962]"> One price. One payment. Ships in 48 hours.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#calculator" 
              className="inline-flex items-center justify-center gap-2 bg-[#B50012] hover:bg-[#9A0010] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-red-900/30"
            >
              <span>💰</span> See How Much You Save
            </Link>
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
            >
              Shop Now <span>→</span>
            </Link>
          </div>

          {/* Headline Indicators */}
          <div className="flex justify-center gap-2 mt-10">
            {headlines.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsVisible(true);
                  }, 300);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-[#B50012] w-6' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 50L48 45.7C96 41.3 192 32.7 288 30.2C384 27.7 480 31.3 576 38.5C672 45.7 768 56.3 864 58.8C960 61.3 1056 55.7 1152 50C1248 44.3 1344 38.7 1392 35.8L1440 33V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="#F5F5F0"/>
        </svg>
      </div>
    </section>
  );
}
