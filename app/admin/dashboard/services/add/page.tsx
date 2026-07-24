'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { ImagePlus, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function AddServicePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !file) {
      setError('Please enter a name and pick an image.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // 1. Upload to Cloudinary via our API route
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

      // 2. Save to Firestore
      await addDoc(collection(db, 'services'), {
        name: name.trim(),
        imageUrl: uploadData.url,
        publicId: uploadData.publicId,
        createdAt: serverTimestamp(),
      });

      router.push('/admin/dashboard/services');
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-[#4a0010] mb-6 font-cinzel">Add Service</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Image picker */}
        <label className="cursor-pointer">
          <div
            className="w-full aspect-video rounded-xl border-2 border-dashed border-[#C9A96E]/50 flex flex-col items-center justify-center overflow-hidden bg-[#fdf6ee] hover:border-[#C0001A]/40 transition-colors"
          >
            {preview ? (
              <div className="relative w-full h-full">
                <Image src={preview} alt="preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#C9A96E]">
                <ImagePlus size={32} />
                <p className="text-sm font-medium">Click to pick an image</p>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>

        {/* Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Service name (e.g. Facial, Haircut)"
          className="border border-[#C9A96E]/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001A]/30"
        />

        {error && <p className="text-xs text-[#C0001A]">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-[#C0001A] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#4a0010] transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          {loading ? 'Uploading...' : 'Save Service'}
        </button>
      </form>
    </div>
  );
}