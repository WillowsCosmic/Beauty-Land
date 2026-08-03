/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: string;
  name: string;
  imageUrl: string;
  publicId: string;
  createdAt: any;
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const centerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchServices = async () => {
      const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];
      setServices(data);
    };
    fetchServices();
  }, []);

  // Scroll-triggered entrance animation
  useEffect(() => {
    if (!services.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        [leftRef.current, centerRef.current, rightRef.current],
        { opacity: 0, y: 80, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.25,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [services]);

  // Generate particles for render
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    duration: Math.random() * 3 + 4,
    left: Math.random() * 100,
    size: Math.random() * 3 + 1,
  }));

  const goTo = (index: number) => {
    if (animating || services.length === 0) return;
    setAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(index);
        setAnimating(false);
      },
    });

    tl.to([centerRef.current, leftRef.current, rightRef.current], {
      opacity: 0,
      scale: 0.95,
      duration: 0.35,
      ease: "power2.in",
    }).set([centerRef.current, leftRef.current, rightRef.current], {
      opacity: 1,
      scale: 1,
    });
  };

  const prev = () => goTo((activeIndex - 1 + services.length) % services.length);
  const next = () => goTo((activeIndex + 1) % services.length);
  const getIndex = (offset: number) =>
    (activeIndex + offset + services.length) % services.length;

  if (services.length === 0) {
    return (
      <section className="w-full py-24 flex items-center justify-center bg-[#1a0005]">
        <p className="text-[#C9A96E] font-cinzel tracking-widest text-sm animate-pulse">
          Loading Services...
        </p>
      </section>
    );
  }

  const center = services[getIndex(0)];
  const left = services[getIndex(-1)];
  const right = services[getIndex(1)];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#30000a] py-24 px-4 overflow-hidden relative"
    >
      {/* Particle background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: `rgba(201, 169, 110, 0.6)`,
              boxShadow: `0 0 ${p.size * 2}px rgba(253, 226, 66, 0.8)`,
            }}
            initial={{ bottom: "-10%", opacity: 0 }}
            animate={{
              bottom: "110%",
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        <div ref={headingRef} className="text-center mb-16 opacity-0">
          <p className="text-[#C9A96E] tracking-[0.4em] text-xs uppercase font-light mb-3">
            What We Offer
          </p>
          <h2 className="font-cinzel text-4xl md:text-5xl text-white font-semibold">
            Our Services
          </h2>
          <div className="mx-auto mt-4 w-16 h-[1px] bg-[#C9A96E]" />
        </div>

        <div
          ref={carouselRef}
          className="relative flex items-center justify-center max-w-6xl mx-auto h-[600px] md:h-[680px]"
        >
          <button
            onClick={prev}
            className="absolute left-0 z-30 w-10 h-10 rounded-full border border-[#C9A96E33] text-[#C9A96E] flex items-center justify-center hover:bg-[#C9A96E22] transition-all text-2xl"
          >
            ‹
          </button>

          <div
            ref={leftRef}
            onClick={prev}
            style={{ transform: "rotate(-4deg)" }}
            className="absolute left-[1%] md:left-[4%] w-[220px] md:w-[280px] h-[340px] md:h-[420px] z-10 cursor-pointer group/left opacity-0"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#C9A96E33] shadow-2xl transition-all duration-500 group-hover/left:shadow-[0_0_35px_#C9A96E33] group-hover/left:-translate-y-4 group-hover/left:scale-[1.04]">
              <Image
                src={left.imageUrl}
                alt={left.name}
                fill
                className="object-cover brightness-50 group-hover/left:brightness-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-0 right-0 text-center text-white font-cinzel text-sm px-2 truncate">
                {left.name}
              </p>
            </div>
          </div>

          <div
            ref={centerRef}
            className="relative z-20 w-[300px] md:w-[400px] h-[460px] md:h-[560px] group/center opacity-0"
          >
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 text-[130px] font-cinzel font-bold text-white/5 select-none leading-none">
              {String(getIndex(0) + 1).padStart(2, "0")}
            </span>

            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#C9A96E55] shadow-[0_0_50px_#C9A96E22] transition-all duration-700 group-hover/center:-translate-y-5 group-hover/center:shadow-[0_0_70px_#C9A96E44]">
              <Image
                src={center.imageUrl}
                alt={center.name}
                fill
                className="object-cover group-hover/center:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 bg-[#C9A96E] text-[#1a0005] text-xs font-cinzel px-3 py-1 rounded-full tracking-widest">
                {String(getIndex(0) + 1).padStart(2, "0")}
              </div>
              <p className="absolute bottom-6 left-0 right-0 text-center text-white font-cinzel text-2xl font-semibold px-4 truncate">
                {center.name}
              </p>
            </div>
          </div>

          <div
            ref={rightRef}
            onClick={next}
            style={{ transform: "rotate(4deg)" }}
            className="absolute right-[1%] md:right-[4%] w-[220px] md:w-[280px] h-[340px] md:h-[420px] z-10 cursor-pointer group/right opacity-0"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#C9A96E33] shadow-2xl transition-all duration-500 group-hover/right:shadow-[0_0_35px_#C9A96E33] group-hover/right:-translate-y-4 group-hover/right:scale-[1.04]">
              <Image
                src={right.imageUrl}
                alt={right.name}
                fill
                className="object-cover brightness-50 group-hover/right:brightness-75 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-4 left-0 right-0 text-center text-white font-cinzel text-sm px-2 truncate">
                {right.name}
              </p>
            </div>
          </div>

          <button
            onClick={next}
            className="absolute right-0 z-30 w-10 h-10 rounded-full border border-[#C9A96E33] text-[#C9A96E] flex items-center justify-center hover:bg-[#C9A96E22] transition-all text-2xl"
          >
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {services.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-0.75 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-8 bg-[#C9A96E]" : "w-3 bg-[#C9A96E44]"
              }`}
            />
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <Link
            href="/services"
            className="group relative inline-flex items-center gap-3 border border-[#C9A96E] text-[#C9A96E] font-cinzel text-sm tracking-[0.3em] px-10 py-4 uppercase hover:bg-[#C9A96E] hover:text-[#1a0005] transition-all duration-500"
          >
            Explore All Services
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}