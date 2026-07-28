"use client";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import Navbar from "./Navbar";

export default function Hero() {

    const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const word = "Beauty  Land";

  useEffect(() => {
    const letters = lettersRef.current.filter(Boolean);

    // Start hidden
    gsap.set(letters, { opacity: 0, y: 60, rotateX: -90, scale: 0.5 });

    const tl = gsap.timeline({ delay: 0.3 });

    // Each letter flies in with stagger
    tl.to(letters, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.06,
      ease: "back.out(1.7)",
    })
    // Shimmer sweep across all letters
    .to(letters, {
      color: "#C9A96E",
      textShadow: "0 0 20px #C9A96E, 0 0 40px #C9A96E88",
      duration: 0.08,
      stagger: 0.05,
      ease: "none",
    }, "-=0.2")
    // Fade shimmer back to white
    .to(letters, {
      color: "#ffffff",
      textShadow: "0 0 0px transparent",
      duration: 0.4,
      stagger: 0.03,
      ease: "power2.out",
    }, "-=0.2");
  }, []);

  return (
    <motion.section
      className="min-h-screen flex items-center justify-start px-16 relative"
      style={{
        backgroundImage: "url('/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
          <Navbar />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: "#000000", opacity: 0.75 }} />

      {/* Content */}
      <div className="relative z-10 text-white max-w-xl">
        <motion.p
          className="text-sm uppercase tracking-widest mb-3 font-medium "
          style={{ color: "#C9A96E" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome to
        </motion.p>
        <h1 className="text-6xl font-bold mb-6 flex flex-wrap font-cinzel" style={{ perspective: "600px" }}>
          {word.split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => { lettersRef.current[i] = el; }}
              style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : "normal", cursor: "default" }}
              onMouseEnter={() => {
                const el = lettersRef.current[i];
                if (!el) return;
                gsap.killTweensOf(el);
                gsap.timeline()
                  .to(el, {
                    color: "#C9A96E",
                    textShadow: "0 0 20px #C9A96E, 0 0 50px #C9A96Eaa, 0 0 80px #C9A96E55",
                    scale: 1.3,
                    y: -8,
                    duration: 0.2,
                    ease: "power2.out",
                  })
                  .to(el, {
                    scale: 1.1,
                    y: -4,
                    duration: 0.15,
                    ease: "power1.inOut",
                  });
              }}
              onMouseLeave={() => {
                const el = lettersRef.current[i];
                if (!el) return;
                gsap.killTweensOf(el);
                gsap.to(el, {
                  color: "#ffffff",
                  textShadow: "0 0 0px transparent",
                  scale: 1,
                  y: 0,
                  duration: 0.4,
                  ease: "power2.out",
                });
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <motion.p
          className="text-lg mb-10 opacity-90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Premium salon services tailored just for you. Hair, skin, nails & more — all in one place.
        </motion.p>
        <motion.button
          className="group inline-flex items-center space-x-2 bg-[#C9A96E] hover:bg-[#ff7d71] text-white px-8 py-4 cursor-pointer rounded-xl font-semibold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 transition-all duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Book an Appointment
        </motion.button>
      </div>
    </motion.section>
  );
}
