"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  publicId: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchService() {
      try {
        const ref = doc(db, "services", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setService({ id: snap.id, ...(snap.data() as Omit<Service, "id">) });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0005]">
        <p
          className="text-[#C9A96E] tracking-widest text-sm uppercase animate-pulse"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          Loading...
        </p>
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a0005] gap-6 px-6 text-center">
        <h1
          className="text-3xl text-[#f5e9dd]"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          Service Not Found
        </h1>
        <p className="text-[#C9A96E]/70 text-sm">
          The service you are looking for does not exist or has been removed.
        </p>
        <Link
          href="/services"
          className="mt-4 text-xs uppercase tracking-widest text-[#C9A96E] border-b border-[#C9A96E]/50 pb-1 hover:text-[#f5e9dd] hover:border-[#f5e9dd] transition-colors"
        >
          ← Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0005] text-[#f5e9dd]">
      {/* Hero image */}
      <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0005] via-[#1a0005]/30 to-transparent" />
        <button
          onClick={() => router.push("/services")}
          className="absolute top-6 left-6 text-xs uppercase tracking-widest text-[#f5e9dd]/80 hover:text-[#C9A96E] transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
        >
          ← Back
        </button>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 md:px-0 -mt-16 md:-mt-24 relative z-10 pb-24">
        <div className="w-10 h-px bg-[#C9A96E] mb-4" />
        <h1
          className="text-4xl md:text-6xl mb-6 leading-tight"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          {service.name}
        </h1>

        <p className="text-[#f5e9dd]/80 text-base md:text-lg leading-relaxed font-light">
          {service.description}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="inline-block text-center border border-[#C9A96E] text-[#C9A96E] px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#C9A96E] hover:text-[#1a0005] transition-colors duration-300"
          >
            Book This Service
          </Link>
          <Link
            href="/services"
            className="inline-block text-center text-[#f5e9dd]/60 px-8 py-3 text-xs uppercase tracking-widest hover:text-[#C9A96E] transition-colors duration-300"
          >
            View All Services
          </Link>
        </div>
      </div>
    </div>
  );
}
