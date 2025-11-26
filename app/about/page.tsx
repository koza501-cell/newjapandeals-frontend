import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | New Japan Deals - Authentic Japanese Watches',
  description: 'Learn about New Japan Deals, your trusted source for authentic Japanese watches. Direct from Japan with worldwide shipping. Seiko, Citizen, G-Shock & more.',
  alternates: {
    canonical: 'https://newjapandeals.com/about',
  },
};

export default function AboutPage() {
  return (
    <div className="container-custom py-12">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-6">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="text-gray-900">About Us</span>
      </nav>

      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-8 text-center">
          About New Japan Deals
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8 text-center">
            Your trusted source for authentic Japanese watches, shipped directly from Japan.
          </p>

          <h2>Our Story</h2>
          <p>
            New Japan Deals was founded with a simple mission: to bring authentic Japanese watches 
            to collectors and enthusiasts around the world. Based in Japan, we have direct access 
            to the finest Japanese timepieces, from iconic brands like Seiko and Citizen to rare 
            vintage pieces that are nearly impossible to find outside of Japan.
          </p>

          <h2>Why Japanese Watches?</h2>
          <p>
            Japan has a rich history of watchmaking excellence. Japanese watch brands are renowned 
            for their precision, reliability, and innovative technology. From Seiko's legendary 
            Spring Drive movement to Citizen's groundbreaking Eco-Drive solar technology, Japanese 
            watchmakers continue to push the boundaries of horological innovation.
          </p>

          <h2>Our Commitment to Authenticity</h2>
          <p>
            Every watch we sell is 100% authentic. We source our watches directly from trusted 
            Japanese suppliers and carefully inspect each piece before listing. Our detailed 
            photographs and honest descriptions ensure you know exactly what you're getting.
          </p>

          <h2>Worldwide Shipping</h2>
          <p>
            We ship to over 100 countries worldwide. Every shipment includes full tracking and 
            insurance. We carefully package each watch to ensure it arrives safely at your doorstep, 
            no matter where you are in the world.
          </p>

          <h2>Our Selection</h2>
          <p>We specialize in:</p>
          <ul>
            <li><strong>Seiko</strong> - From the affordable Seiko 5 to the prestigious Grand Seiko</li>
            <li><strong>Citizen</strong> - Eco-Drive technology and elegant designs</li>
            <li><strong>Casio & G-Shock</strong> - Tough, reliable, and iconic</li>
            <li><strong>Orient</strong> - Affordable mechanical excellence</li>
            <li><strong>Vintage Watches</strong> - Rare and collectible Japanese timepieces</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            Have questions? We're here to help. Visit our{' '}
            <Link href="/contact" className="text-primary hover:underline">contact page</Link>{' '}
            to get in touch with our team.
          </p>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <div className="text-3xl mb-2">🇯🇵</div>
            <div className="font-semibold">Based in Japan</div>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">✓</div>
            <div className="font-semibold">100% Authentic</div>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">🌍</div>
            <div className="font-semibold">Ships Worldwide</div>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">🔒</div>
            <div className="font-semibold">Secure Payment</div>
          </div>
        </div>
      </article>
    </div>
  );
}
