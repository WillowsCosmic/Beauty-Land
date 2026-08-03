"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface GalleryPhoto {
  id: string;
  publicId: string;
  url: string;
  caption?: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { publicId: string; url: string; caption?: string }),
      }));
      setPhotos(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openAt = useCallback((idx: number) => setActiveIndex(idx), []);
  const close = useCallback(() => setActiveIndex(null), []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, goPrev, goNext]);

  const active = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <main className="min-h-screen bg-[#1a0005] text-[#f5e9dd]">
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      {/* Header */}
      <div className="pt-28 pb-12 px-6 text-center border-b border-[#C9A96E]/15">
        <span className="text-[#C9A96E]/50 text-xs tracking-[0.3em] uppercase">
          03 — Gallery
        </span>
        <h1
          className="text-4xl md:text-5xl mt-3 mb-4"
          style={{ fontFamily: "Cinzel, serif" }}
        >
          Our Gallery
        </h1>
        <p className="text-[#f5e9dd]/60 max-w-md mx-auto text-sm leading-relaxed">
          A glimpse into the artistry, ambience, and transformations at Beauty Land
        </p>
        <Link
          href="/"
          prefetch
          className="inline-block mt-6 text-xs uppercase tracking-widest text-[#C9A96E]/70 hover:text-[#C9A96E] transition-colors"
        >
          ← Back Home
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-32">
          <Loader2 className="animate-spin text-[#C9A96E]" size={32} />
        </div>
      )}

      {/* Empty state */}
      {!loading && photos.length === 0 && (
        <div className="flex flex-col items-center py-32 text-[#f5e9dd]/40">
          <p className="text-lg">Gallery coming soon</p>
        </div>
      )}

      {/* Masonry Grid */}
      {!loading && photos.length > 0 && (
        <div className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
          <div className="columns-2 md:columns-4 lg:columns-5 gap-4 [&>*]:mb-4">
            {photos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={() => openAt(idx)}
                className="relative w-full block overflow-hidden rounded-sm border border-[#C9A96E]/15 group focus:outline-none"
              >
                <div className="relative w-full" style={{ aspectRatio: idx % 3 === 0 ? "3/4" : "4/5" }}>
                  <Image
                    src={photo.url}
                    alt={photo.caption || "Gallery photo"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute inset-0 border border-[#C9A96E]/0 group-hover:border-[#C9A96E]/60 transition-colors duration-300" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {active && (
        <div className="fixed inset-0 z-[999] bg-[#0d0002]/97 backdrop-blur-sm flex flex-col">
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-6 right-6 z-10 text-[#f5e9dd]/60 hover:text-[#C9A96E] transition-colors"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* Main image area */}
          <div className="flex-1 flex items-center justify-center px-6 md:px-20 relative min-h-0">
            {/* Prev arrow */}
            <button
              onClick={goPrev}
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-[#C9A96E]/50 hover:text-[#C9A96E] transition-colors z-10"
              aria-label="Previous photo"
            >
              <ChevronLeft size={36} />
            </button>

            <div className="relative w-full h-full max-w-4xl flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={active.id}
                src={active.url}
                alt={active.caption || "Gallery photo"}
                className="max-w-full max-h-[70vh] w-auto h-auto object-contain animate-[fadeIn_0.3s_ease] rounded-sm"
              />
            </div>

            {/* Next arrow */}
            <button
              onClick={goNext}
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-[#C9A96E]/50 hover:text-[#C9A96E] transition-colors z-10"
              aria-label="Next photo"
            >
              <ChevronRight size={36} />
            </button>
          </div>

          {/* Caption + counter */}
          <div className="text-center pb-4 px-6">
            {active.caption && (
              <p
                className="text-[#f5e9dd] text-lg mb-1"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                {active.caption}
              </p>
            )}
            <p className="text-[#C9A96E]/50 text-xs uppercase tracking-widest">
              {String(activeIndex! + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </p>
          </div>

          {/* Thumbnail strip */}
          <div className="border-t border-[#C9A96E]/15 py-4 px-4 overflow-x-auto">
            <div className="flex gap-3 justify-center min-w-max mx-auto">
              {photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all duration-200 ${
                    idx === activeIndex
                      ? "border-[#C9A96E] opacity-100 scale-105"
                      : "border-[#C9A96E]/20 opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={photo.url}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
