// components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* About */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-white">SereneWay</h3>
          <p className="mb-4 text-gray-300">
            Discover amazing tours and experiences worldwide. Our mission is to make travel planning smooth, safe, and memorable for everyone.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" aria-label="Facebook" className="hover:text-blue-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.987H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.242 0-1.631.771-1.631 1.562v1.875h2.773l-.443 2.89h-2.33V21.877C18.343 21.128 22 16.991 22 12"/></svg>
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.793.352-1.644.59-2.538.697a4.48 4.48 0 001.965-2.478 8.94 8.94 0 01-2.828 1.082A4.478 4.478 0 0016.11 4c-2.48 0-4.49 2.012-4.49 4.495 0 .353.04.696.116 1.024C7.728 9.37 4.1 7.554 1.67 4.973c-.388.666-.61 1.44-.61 2.27 0 1.566.797 2.948 2.012 3.758a4.462 4.462 0 01-2.034-.563v.057c0 2.188 1.556 4.016 3.623 4.433a4.493 4.493 0 01-2.025.076c.573 1.787 2.236 3.087 4.205 3.122A8.99 8.99 0 012 19.54a12.68 12.68 0 006.88 2.017c8.26 0 12.785-6.84 12.785-12.77 0-.195-.004-.39-.013-.583A9.19 9.19 0 0024 4.59a8.99 8.99 0 01-2.54.697z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm4.25 3.25A5.25 5.25 0 1112 18.25a5.25 5.25 0 010-10.5zm0 1.5a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zm5.25-.75a1 1 0 110 2 1 1 0 010-2z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline text-gray-300">Home</Link></li>
            <li><Link to="/user/tours" className="hover:underline text-gray-300">Tour Packages</Link></li>
            <li><Link to="/about" className="hover:underline text-gray-300">About Us</Link></li>
            <li><Link to="/contact" className="hover:underline text-gray-300">Contact</Link></li>
            <li><Link to="/faq" className="hover:underline text-gray-300">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
          <ul className="space-y-2 text-gray-300">
            <li>123 Main Street, Colombo, Sri Lanka</li>
            <li>+94 77 123 4567</li>
            <li>info@sereneway.com</li>
            <li>
              <span className="block mt-2">Mon - Fri: 9am - 6pm</span>
              <span>Sat - Sun: 10am - 4pm</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-white">Newsletter</h4>
          <p className="mb-4 text-gray-300">Subscribe to get the latest tour updates and offers.</p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="Your email"
              className="rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} SereneWay. All rights reserved.
      </div>
    </footer>
  );
}
