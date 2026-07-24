"use client";

import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import Image from "next/image";
import { Trash2, Upload, Loader2, ImagePlus } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";

interface GalleryPhoto {
  id: string;
  publicId: string;
  url: string;
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch photos from Firestore in real time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "gallery"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { publicId: string; url: string }),
      }));
      setPhotos(data);
    });
    return () => unsub();
  }, []);

  // Handle file upload
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      await addDoc(collection(db, "gallery"), {
        publicId: data.publicId,
        url: data.url,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // Handle delete
  async function handleDelete(photo: GalleryPhoto) {
    const result = await Swal.fire({
      title: "Delete this photo?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C0001A",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    setDeletingId(photo.id);
    try {
      await fetch("/api/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: photo.publicId }),
      });
      await deleteDoc(doc(db, "gallery", photo.id));
    } catch (err) {
      console.error(err);
      toast.error("Delete failed. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#4a0010] font-cinzel">Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">{photos.length} photo{photos.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-[#C0001A] hover:bg-[#a0001a] text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload Photo
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* Empty State */}
      {photos.length === 0 && !uploading && (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <ImagePlus size={48} className="mb-4 opacity-40" />
          <p className="text-lg font-medium">No photos yet</p>
          <p className="text-sm mt-1">Click Upload Photo to add your first one</p>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden shadow">
            <Image
              src={photo.url}
              alt="Gallery photo"
              fill
              className="object-cover"
            />
            {/* Delete Button */}
            <button
              onClick={() => handleDelete(photo)}
              disabled={deletingId === photo.id}
              className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-1.5 rounded-lg transition"
              title="Delete photo"
            >
              {deletingId === photo.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
