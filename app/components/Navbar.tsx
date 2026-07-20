"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#fce4c6] border-b border-[#e8e0d5] shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/">
            <img
              src="/Beauty-Hair.png"
              alt="Beauty Hair Logo"
              width={80}
              height={80}
            />
          </Link>
        </motion.div>

        {/* Desktop Nav Links */}
        <motion.div
          className="hidden md:flex gap-8 text-sm font-medium text-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="#services" className="hover:text-[#C0001A] transition">Services</Link>
          <Link href="#gallery" className="hover:text-[#C0001A] transition">Gallery</Link>
          <Link href="#contact" className="hover:text-[#C0001A] transition">Contact</Link>
        </motion.div>

        {/* Desktop Book Button */}
        <motion.button
          className="hidden md:block px-5 py-2 text-sm font-medium text-white rounded-lg shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: "#C0001A" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Book Now
        </motion.button>

        {/* Hamburger Icon (mobile only) */}
        <button
          className="md:hidden flex flex-col gap-1.5 z-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <motion.span
            className="block w-6 h-0.5 bg-gray-800"
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-gray-800"
            animate={{ opacity: menuOpen ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="block w-6 h-0.5 bg-gray-800"
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-white px-6 pb-6 flex flex-col gap-4 text-sm font-medium text-gray-700 shadow-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="#services" onClick={() => setMenuOpen(false)} className="hover:text-[#C0001A] transition">Services</Link>
            <Link href="#gallery" onClick={() => setMenuOpen(false)} className="hover:text-[#C0001A] transition">Gallery</Link>
            <Link href="#contact" onClick={() => setMenuOpen(false)} className="hover:text-[#C0001A] transition">Contact</Link>
            <button
              className="w-full px-5 py-2 text-sm font-medium text-white rounded-lg shadow-red-500/30 hover:shadow-red-500/50 duration-200 hover:scale-105 transition-all "
              style={{ backgroundColor: "#C0001A" }}
            >
              Book Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}