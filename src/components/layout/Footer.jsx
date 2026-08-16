"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Smartphone, Check, ChevronRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("Please agree to the Privacy Policy first.");
      return;
    }
    if (whatsappNumber.length < 10) {
      alert("Please enter a valid WhatsApp number.");
      return;
    }
    // Dummy subscribe logic
    setSubscribed(true);
    setWhatsappNumber('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="w-full bg-[#191919] text-[#b0b0b0] font-sans">
      
      {/* Newsletter Section */}
      <div className="w-full border-b border-[#333333]">
        <div className="mx-auto max-w-[1226px] px-4 py-12 md:py-16 text-center">
          <h3 className="text-white text-[24px] font-bold tracking-tight mb-2">To subscribe to our newsletters</h3>
          <p className="text-[14px] mb-8">Subscribe to get the latest news and exclusive offers on WhatsApp</p>
          
          <form onSubmit={handleSubscribe} className="max-w-[480px] mx-auto">
            <div className="flex items-center bg-[#2a2a2a] rounded-lg overflow-hidden border border-[#333333] focus-within:border-white transition-colors">
              <span className="pl-4 text-white font-medium">+91</span>
              <input 
                type="tel" 
                placeholder="Enter WhatsApp Number" 
                className="w-full bg-transparent px-3 py-4 text-white text-[14px] outline-none placeholder:text-[#737373]"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-[#444] hover:bg-[#555] text-white px-8 py-4 font-bold text-[14px] transition-colors flex items-center justify-center min-w-[140px]"
              >
                {subscribed ? <Check className="h-5 w-5" /> : 'Subscribe'}
              </button>
            </div>
            
            <div className="flex items-center justify-center mt-4 gap-2">
              <input 
                type="checkbox" 
                id="privacy-policy" 
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-[#ff6900] focus:ring-[#ff6900]"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label htmlFor="privacy-policy" className="text-[12px] text-[#888]">
                I have read and agree to QuickStore's <Link href="/privacy-policy" className="text-white hover:underline">Privacy Policy</Link>
              </label>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className="mx-auto max-w-[1226px] px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Columns 1-4 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-[14px] font-bold mb-3 uppercase tracking-wider">Support</h4>
            <Link href="/faq" className="text-[14px] hover:text-white transition-colors">FAQ</Link>
            <Link href="/warranty" className="text-[14px] hover:text-white transition-colors">Warranty</Link>
            <Link href="/returns" className="text-[14px] hover:text-white transition-colors">Returns & Exchanges</Link>
            <Link href="/track-order" className="text-[14px] hover:text-white transition-colors">Track Order</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-white text-[14px] font-bold mb-3 uppercase tracking-wider">Shop and Learn</h4>
            <Link href="/collections/premium" className="text-[14px] hover:text-white transition-colors">Premium Series</Link>
            <Link href="/collections/sports" className="text-[14px] hover:text-white transition-colors">Sports Active</Link>
            <Link href="/collections/hybrid" className="text-[14px] hover:text-white transition-colors">Hybrid Classics</Link>
            <Link href="/accessories" className="text-[14px] hover:text-white transition-colors">Watch Straps</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-white text-[14px] font-bold mb-3 uppercase tracking-wider">Retail Store</h4>
            <Link href="/stores" className="text-[14px] hover:text-white transition-colors">Find a Store</Link>
            <Link href="/service-centers" className="text-[14px] hover:text-white transition-colors">Service Centers</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-white text-[14px] font-bold mb-3 uppercase tracking-wider">About Us</h4>
            <Link href="/about" className="text-[14px] hover:text-white transition-colors">Our Story</Link>
            <Link href="/contact" className="text-[14px] hover:text-white transition-colors">Contact Us</Link>
            <Link href="/careers" className="text-[14px] hover:text-white transition-colors">Careers</Link>
          </div>

          {/* Column 5: Social & Contact */}
          <div className="flex flex-col gap-6 lg:col-span-1 col-span-2">
            <div>
              <h4 className="text-white text-[14px] font-bold mb-4 uppercase tracking-wider">Follow Us</h4>
              <div className="flex items-center gap-4">
                <a href="#" className="h-8 w-8 rounded-full bg-[#333] flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" className="h-8 w-8 rounded-full bg-[#333] flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
                <a href="#" className="h-8 w-8 rounded-full bg-[#333] flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white text-[14px] font-bold mb-2 uppercase tracking-wider">Customer Service</h4>
              <p className="text-[28px] font-bold text-[#ff6900]">1800 103 6286</p>
              <p className="text-[12px] mt-1">Hours: 9:00am - 9:00pm</p>
            </div>

          </div>
          
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="border-t border-[#222] bg-[#111]">
        <div className="mx-auto max-w-[1226px] px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#666]">
            &copy; {currentYear} QuickStore. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] text-[#666]">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/site-map" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
