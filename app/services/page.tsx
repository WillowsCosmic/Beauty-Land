"use client";

import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: string;
  name: string;
  imageUrl: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const snap = await getDocs(collection(db, "services"));
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Service, "id">),
      }));
      setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (!loading && gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".service-card");

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          },
        }
      );
    }
  }, [loading]);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "#1a0005", fontFamily: "serif" }}
    >
      {/* Hero Banner */}
      <section className="relative pt-36 pb-16 px-6 text-center overflow-hidden">
        {/* Gold blur orb */}
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #C9A96E, transparent 70%)" }}
        />

        <div ref={headingRef} className="relative z-10">
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: "#C9A96E" }}
          >
            Beauty Land
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{
              fontFamily: "'Cinzel', serif",
              color: "#fff",
              textShadow: "0 0 60px rgba(201,169,110,0.15)",
            }}
          >
            Our Services
          </h1>
          <div
            className="w-16 h-px mx-auto mb-6"
            style={{ backgroundColor: "#C9A96E" }}
          />
          <p className="text-white/50 text-sm tracking-wide max-w-md mx-auto">
            Every treatment is a ritual. Every visit, a transformation.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 md:px-16 pb-24">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "#C9A96E", borderTopColor: "transparent" }}
            />
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid gap-5"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Back link */}
      <div className="text-center pb-20">
        <Link
          href="/"
          className="text-xs tracking-[0.3em] uppercase transition-colors duration-300"
          style={{ color: "#C9A96E" }}
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [hovered, setHovered] = useState(false);

  // Vary card heights for a masonry-like rhythm
  const heights = ["360px", "420px", "380px", "440px", "360px", "400px"];
  const height = heights[index % heights.length];

  return (
    <Link
      href={`/services/${service.id}`}
      className="service-card relative overflow-hidden cursor-pointer opacity-0 block"
      style={{
        height,
        borderRadius: "4px",
        border: hovered ? "1px solid rgba(201,169,110,0.5)" : "1px solid rgba(201,169,110,0.1)",
        transition: "border 0.4s ease, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.5s ease",
        transform: hovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 24px 60px rgba(201,169,110,0.2), 0 0 0 1px rgba(201,169,110,0.1)"
          : "0 8px 30px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={service.imageUrl}
        alt={service.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}
      />

      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(26,0,5,0.95) 0%, rgba(26,0,5,0.4) 50%, transparent 100%)",
        }}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(201,169,110,0.12), transparent 60%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Gold number watermark */}
      <div
        className="absolute top-4 right-5 font-bold select-none pointer-events-none"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "5rem",
          lineHeight: 1,
          color: "rgba(201,169,110,0.08)",
          transition: "color 0.4s ease",
          ...(hovered && { color: "rgba(201,169,110,0.15)" }),
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div
          className="w-6 h-px mb-3"
          style={{
            backgroundColor: "#C9A96E",
            transition: "width 0.4s ease",
            width: hovered ? "40px" : "24px",
          }}
        />
        <h3
          className="text-xl font-semibold tracking-wide"
          style={{ fontFamily: "'Cinzel', serif", color: "#fff" }}
        >
          {service.name}
        </h3>
        <p
          className="text-xs tracking-[0.25em] uppercase mt-1"
          style={{
            color: "#C9A96E",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          View Details →
        </p>
      </div>
    </Link>
  );
}
