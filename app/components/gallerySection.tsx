"use client";

import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface GalleryPhoto {
  id: string;
  publicId: string;
  url: string;
}

export default function GallerySection() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch photos from Firestore in real time
  useEffect(() => {
    const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { publicId: string; url: string }),
      }));
      setPhotos(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Scroll progress across the pinned (sticky) section — no GSAP pin-spacer,
  // so there's no risk of a mismatched scroll-distance / dead white gap.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth the raw scroll progress a touch so the curtains feel weighted
  // rather than snapping 1:1 with the scrollbar.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  // Heading fades/lifts out first (0 -> 0.25)
  const headingOpacity = useTransform(smoothProgress, [0, 0.22], [1, 0]);
  const headingY = useTransform(smoothProgress, [0, 0.22], [0, -30]);

  // Curtains part next (0.15 -> 0.55)
  const leftCurtainX = useTransform(smoothProgress, [0.15, 0.55], ["0%", "-100%"]);
  const rightCurtainX = useTransform(smoothProgress, [0.15, 0.55], ["0%", "100%"]);

  // Grid reveals after curtains are mostly open (0.45 -> 0.85)
  const gridOpacity = useTransform(smoothProgress, [0.45, 0.7], [0, 1]);
  const gridScale = useTransform(smoothProgress, [0.45, 0.7], [0.9, 1]);
  const gridY = useTransform(smoothProgress, [0.45, 0.7], [40, 0]);

  // Button fades in near the very end
  const buttonOpacity = useTransform(smoothProgress, [0.8, 1], [0, 1]);

  return (
    <section ref={containerRef} className="relative w-full h-[250vh]">
      {/* Sticky viewport — stays pinned to the screen for the scroll duration,
          no separate spacer element to fall out of sync with. */}
      <div
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{
          backgroundImage: "url(/gallery-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Cream overlay so photos/text stay legible over the floral bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf6f0]/90 via-[#f5ede3]/88 to-[#faf6f0]/92" />

        {/* Heading, visible before curtains open */}
        <motion.div
          style={{ opacity: headingOpacity, y: headingY }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6"
        >
          <span className="text-[#a8763f]/70 text-xs tracking-[0.3em] mb-3">03</span>
          <h2
            className="text-4xl md:text-5xl text-[#4a0010] mb-4"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            Our Gallery
          </h2>
          <div className="w-16 h-px bg-[#a8763f] mb-4" />
          <p className="text-[#4a0010]/70 text-sm max-w-md">
            A glimpse into the artistry, ambience, and transformations at Beauty
            Land
          </p>
          <p className="text-[#a8763f] text-xs uppercase tracking-widest mt-8 animate-pulse">
            Scroll to reveal ↓
          </p>
        </motion.div>

        {/* Photo grid, revealed once curtains part */}
        <motion.div
          style={{ opacity: gridOpacity }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
        >
          {/* Persistent title, stays visible after curtains open */}
          <div className="text-center mb-6">
            <span className="text-[#a8763f]/70 text-xs tracking-[0.3em] block mb-2">
              03
            </span>
            <h2
              className="text-3xl md:text-4xl text-[#4a0010]"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Our Gallery
            </h2>
            <div className="w-16 h-px bg-[#a8763f] mx-auto mt-3" />
          </div>

          {photos.length === 0 ? (
            <p className="text-[#4a0010]/40 text-sm">Gallery coming soon</p>
          ) : (
            <motion.div
              style={{ scale: gridScale, y: gridY }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl w-full"
            >
              {photos.slice(0, 8).map((photo, i) => (
                <div
                  key={photo.id}
                  className="gallery-card relative aspect-[3/4] rounded-lg overflow-hidden border border-[#C9A96E]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
                  style={{
                    transform: i % 2 === 0 ? "rotate(-1.5deg)" : "rotate(1.5deg)",
                  }}
                >
                  <Image
                    src={photo.url}
                    alt="Gallery photo"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0005]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Explore button, fades in near the end of the scroll sequence */}
        <motion.div
          style={{ opacity: buttonOpacity }}
          className="absolute bottom-8 left-0 w-full z-20 flex justify-center"
        >
          <Link
            href="/gallery"
            className="inline-block border border-[#a8763f] text-[#4a0010] px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#a8763f] hover:text-[#faf6f0] transition-colors duration-300 bg-[#faf6f0]/70 backdrop-blur-sm"
          >
            Explore Full Gallery →
          </Link>
        </motion.div>

        {/* Curtain panels */}
        <motion.div
          style={{ x: leftCurtainX }}
          className="absolute top-0 left-0 w-1/2 h-full z-30 bg-[#faf6f0] border-r border-[#a8763f]/50"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(168,118,63,0.08) 0px, rgba(168,118,63,0.08) 2px, transparent 2px, transparent 40px)",
            }}
          />
          <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#a8763f] to-transparent" />
        </motion.div>
        <motion.div
          style={{ x: rightCurtainX }}
          className="absolute top-0 right-0 w-1/2 h-full z-30 bg-[#faf6f0] border-l border-[#a8763f]/50"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(168,118,63,0.08) 0px, rgba(168,118,63,0.08) 2px, transparent 2px, transparent 40px)",
            }}
          />
          <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#a8763f] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
