"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-center">

        {/* Desktop Nav Links */}
        <motion.div
          className="hidden md:flex gap-15 text-sm font-medium text-gray-400 mt-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="#services" className="hover:text-[#C0001A] transition">Services</Link>
          <Link href="#gallery" className="hover:text-[#C0001A] transition">Gallery</Link>
          <Link href="#contact" className="hover:text-[#C0001A] transition">Contact</Link>
        </motion.div>


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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}