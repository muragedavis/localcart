'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-20"></div>
        </div>
        <div className="container text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to LocalCart</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Lightweight, fast, and easy online shopping for your local business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-primary bg-white text-blue-600 text-lg px-8 py-3">
              🛍️ Start Shopping
            </Link>
            <Link href="/register" className="btn border-2 border-white text-white text-lg px-8 py-3 hover:bg-white/10">
              📝 Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Why Choose LocalCart?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="font-bold text-xl mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Optimized for speed and performance on any device. Shop faster than ever before.
            </p>
          </div>
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="font-bold text-xl mb-2">Secure & Safe</h3>
            <p className="text-gray-600">
              Your data is protected with modern security practices and encrypted transactions.
            </p>
          </div>
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="font-bold text-xl mb-2">Mobile Friendly</h3>
            <p className="text-gray-600">
              Shop anywhere, anytime on any device. Seamless experience on all screens.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600">5K+</p>
              <p className="text-gray-600 mt-2">Products</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">10K+</p>
              <p className="text-gray-600 mt-2">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">50K+</p>
              <p className="text-gray-600 mt-2">Orders Delivered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">99%</p>
              <p className="text-gray-600 mt-2">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              👤
            </div>
            <h3 className="font-bold text-lg mb-2">1. Sign Up</h3>
            <p className="text-gray-600 text-sm">Create your LocalCart account in seconds</p>
          </div>
          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🛍️
            </div>
            <h3 className="font-bold text-lg mb-2">2. Browse</h3>
            <p className="text-gray-600 text-sm">Explore our wide selection of products</p>
          </div>
          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🛒
            </div>
            <h3 className="font-bold text-lg mb-2">3. Add to Cart</h3>
            <p className="text-gray-600 text-sm">Select items and proceed to checkout</p>
          </div>
          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              🚚
            </div>
            <h3 className="font-bold text-lg mb-2">4. Delivered</h3>
            <p className="text-gray-600 text-sm">Get your order right at your doorstep</p>
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section className="bg-gray-50 py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold">Featured Products</h2>
            <Link href="/shop" className="text-blue-600 font-semibold hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card cursor-pointer hover:shadow-lg transition-shadow">
                <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">📦</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Product {i}</h3>
                <p className="text-gray-600 text-sm mb-3">High quality product</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-600">$29.99</span>
                  <button className="btn-primary text-sm">Add</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section with WhatsApp */}
      <section className="container py-20">
        <div className="card bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">Need Help?</h2>
              <p className="text-gray-700 mb-6 text-lg">
                Our friendly support team is here 24/7 to help you with any questions or concerns.
              </p>
              <div className="space-y-3">
                <a
                  href="https://wa.me/923001234567?text=Hello%20LocalCart%20Support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg font-semibold text-green-600 hover:text-green-700 transition"
                >
                  <span className="text-3xl">💬</span> Chat on WhatsApp
                </a>
                <p className="text-gray-700 flex items-center gap-2">
                  <span className="text-xl">📞</span> +92 300 123 4567
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <span className="text-xl">📧</span> support@localcart.com
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <span className="text-xl">⏰</span> Available 24/7
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">💚</div>
              <p className="text-gray-700 text-lg">
                We're here to make your shopping experience smooth and enjoyable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container">
          <h2 className="text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="card group">
              <summary className="font-bold cursor-pointer flex items-center gap-2">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
                How do I place an order?
              </summary>
              <p className="text-gray-600 mt-3">Simply browse our products, add them to your cart, and proceed to checkout. We accept cash on delivery, card, and bank transfer.</p>
            </details>
            <details className="card group">
              <summary className="font-bold cursor-pointer flex items-center gap-2">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
                How long does delivery take?
              </summary>
              <p className="text-gray-600 mt-3">Most orders are delivered within 3-5 business days. Express delivery options are also available in selected areas.</p>
            </details>
            <details className="card group">
              <summary className="font-bold cursor-pointer flex items-center gap-2">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
                What payment methods do you accept?
              </summary>
              <p className="text-gray-600 mt-3">We accept Cash on Delivery, Credit/Debit Cards, and Bank Transfers for your convenience.</p>
            </details>
            <details className="card group">
              <summary className="font-bold cursor-pointer flex items-center gap-2">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
                What's your refund policy?
              </summary>
              <p className="text-gray-600 mt-3">We offer 30-day returns for all products. If you're not satisfied, contact our support team for hassle-free refunds.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of happy customers shopping with LocalCart
          </p>
          <Link href="/shop" className="btn-primary bg-white text-blue-600 text-lg px-8 py-3">
            🛍️ Start Shopping Now
          </Link>
        </div>
      </section>
    </div>
  );
}
