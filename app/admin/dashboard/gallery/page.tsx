"use client";

import { Images } from "lucide-react";

export default function GalleryPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-[#4a0010] mb-6 font-cinzel">Gallery</h2>
      <div className="border-2 border-dashed border-[#C9A96E]/50 rounded-xl p-16 text-center text-[#C9A96E]">
        <Images size={40} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">Gallery upload coming soon</p>
      </div>
    </div>
  );
}
