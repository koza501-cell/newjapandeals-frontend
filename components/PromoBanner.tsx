'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Banner {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  promo_code: string;
  link_url: string;
  button_text: string;
  bg_color: string;
  text_color: string;
  show_countdown: boolean;
  end_date: string;
  dismissible: boolean;
}

export default function PromoBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await fetch('https://api.newjapandeals.com/api/banners.php?active=1');
        const data = await res.json();
        if (data.success && data.banner) {
          setBanner(data.banner);
        }
      } catch (error) {
        console.error('Failed to fetch banner:', error);
      }
    }
    fetchBanner();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!banner?.show_countdown || !banner?.end_date) return;

    const updateTimer = () => {
      const end = new Date(banner.end_date).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [banner]);

  if (!banner || dismissed) return null;

  return (
    <div 
      className="relative py-3 px-4"
      style={{ backgroundColor: banner.bg_color, color: banner.text_color }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="font-bold">{banner.title}</span>
            {banner.subtitle && (
              <span className="opacity-90">{banner.subtitle}</span>
            )}
            {banner.promo_code && (
              <code className="bg-white/20 px-2 py-1 rounded font-mono font-bold">
                {banner.promo_code}
              </code>
            )}
            {banner.show_countdown && timeLeft && (
              <span className="bg-white/20 px-2 py-1 rounded font-mono">
                ⏱️ {timeLeft}
              </span>
            )}
            {banner.link_url && banner.button_text && (
              <Link 
                href={banner.link_url}
                className="bg-white text-black px-4 py-1 rounded font-medium hover:bg-gray-100 transition-colors"
              >
                {banner.button_text}
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {banner.dismissible && (
        <button 
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      )}
    </div>
  );
}
