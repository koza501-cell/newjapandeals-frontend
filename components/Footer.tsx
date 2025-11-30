import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      {/* Main footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-display font-bold text-gold mb-4">New Japan Deals</h3>
            <p className="text-gray-400 mb-4">
              Your trusted source for authentic Japanese watches. Direct from Japan with worldwide shipping.
            </p>
            <p className="text-sm text-gray-500">
              古物商許可番号: 第441200001622号
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop by Brand</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/brand/seiko" className="hover:text-gold transition-colors">Seiko Watches</Link></li>
              <li><Link href="/brand/citizen" className="hover:text-gold transition-colors">Citizen Watches</Link></li>
              <li><Link href="/brand/casio" className="hover:text-gold transition-colors">Casio Watches</Link></li>
              <li><Link href="/brand/g-shock" className="hover:text-gold transition-colors">G-Shock Watches</Link></li>
              <li><Link href="/brand/orient" className="hover:text-gold transition-colors">Orient Watches</Link></li>
              <li><Link href="/brand/vintage" className="hover:text-gold transition-colors">Vintage Watches</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/why-us" className="hover:text-gold transition-colors">Why Buy From Us</Link></li>
              <li><Link href="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Us</Link></li>
              <li><Link href="/track-order" className="hover:text-gold transition-colors">Track Your Order</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-gold transition-colors">Shipping Information</Link></li>
              <li><Link href="/returns" className="hover:text-gold transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-gold transition-colors">Shipping Policy</Link></li>
            </ul>
            
            <h4 className="font-semibold mt-6 mb-4">Payment Methods</h4>
            <div className="flex gap-2 text-gray-400">
              <span className="bg-white/10 px-2 py-1 rounded text-sm">Visa</span>
              <span className="bg-white/10 px-2 py-1 rounded text-sm">Mastercard</span>
              <span className="bg-white/10 px-2 py-1 rounded text-sm">PayPal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="container-custom py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} New Japan Deals. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">We ship worldwide 🌍</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
