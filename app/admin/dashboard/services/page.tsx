'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Pencil, Trash2, X, Check, Loader2, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import Image from 'next/image';
import Link from 'next/link';

type Service = {
  id: string;
  name: string;
  imageUrl: string;
  publicId: string;
  description?: string;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'services'), (snap) => {
      setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const startEdit = (s: Service) => {
    setEditId(s.id);
    setEditName(s.name);
    setEditImage(null);
    setEditPreview(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditImage(null);
    setEditPreview(null);
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImage(file);
    setEditPreview(URL.createObjectURL(file));
  };

  const saveEdit = async (s: Service) => {
    if (!editName.trim()) return;
    setSaving(true);

    let imageUrl = s.imageUrl;
    let publicId = s.publicId;

    if (editImage) {
      await fetch('/api/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: s.publicId }),
      });

      const formData = new FormData();
      formData.append('file', editImage);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      imageUrl = data.url;
      publicId = data.publicId;
    }

    await updateDoc(doc(db, 'services', s.id), {
      name: editName.trim(),
      imageUrl,
      publicId,
    });

    setSaving(false);
    setEditId(null);
    setEditImage(null);
    setEditPreview(null);
  };

  const handleDelete = async (s: Service) => {
    const result = await Swal.fire({
      title: `Delete "${s.name}"?`,
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C0001A',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });
    if (!result.isConfirmed) return;
    setDeletingId(s.id);
    await fetch('/api/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId: s.publicId }),
    });
    await deleteDoc(doc(db, 'services', s.id));
    setDeletingId(null);
  };

  const handleRegenerate = async (s: Service) => {
    setGeneratingId(s.id);
    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: s.name }),
      });
      const data = await res.json();
      if (res.ok && data.description) {
        await updateDoc(doc(db, 'services', s.id), { description: data.description });
      }
    } catch (err) {
      console.error('Failed to regenerate description', err);
    } finally {
      setGeneratingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-[#C9A96E]">
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#4a0010] font-cinzel">Services</h2>
        <Link
          href="/admin/dashboard/services/add"
          className="bg-[#C0001A] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#4a0010] transition-colors"
        >
          + Add Service
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-sm text-[#C9A96E] text-center py-16">No services yet. Add one!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {services.map((s) => (
            <div
              key={s.id}
              className="relative group bg-white border border-[#C9A96E]/30 rounded-xl overflow-hidden shadow-sm"
            >
              {/* Image */}
              <div className="relative aspect-square w-full">
                <Image
                  src={s.imageUrl}
                  alt={s.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button
                    onClick={() => startEdit(s)}
                    className="bg-white/90 text-[#4a0010] rounded-full p-1.5 hover:bg-white shadow transition"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(s)}
                    disabled={deletingId === s.id}
                    className="bg-white/90 text-[#C0001A] rounded-full p-1.5 hover:bg-white shadow transition disabled:opacity-50"
                  >
                    {deletingId === s.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>

              {/* Name / Edit + Description */}
              <div className="px-3 py-2">
                {editId === s.id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      placeholder="Service name"
                      className="text-xs border border-[#C9A96E]/60 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#C0001A]/40"
                    />
                    <label className="text-xs text-[#C9A96E] cursor-pointer hover:text-[#4a0010] transition-colors">
                      {editPreview ? '✓ New image selected' : '📷 Replace image'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
                    </label>
                    {editPreview && (
                      <div className="relative w-full aspect-square rounded overflow-hidden border border-[#C9A96E]/40">
                        <img src={editPreview} alt="preview" className="object-cover w-full h-full" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(s)}
                        disabled={saving}
                        className="flex-1 flex items-center justify-center gap-1 bg-[#C0001A] text-white text-xs py-1 rounded hover:bg-[#4a0010] transition disabled:opacity-50"
                      >
                        {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 flex items-center justify-center gap-1 bg-gray-100 text-gray-500 text-xs py-1 rounded hover:bg-gray-200 transition"
                      >
                        <X size={12} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-semibold text-[#4a0010] truncate">{s.name}</p>

                    {/* Description preview */}
                    {s.description ? (
                      <p className="text-xs text-gray-400 line-clamp-2">{s.description}</p>
                    ) : (
                      <p className="text-xs text-[#C9A96E]/60 italic">No description yet</p>
                    )}

                    {/* Regenerate button */}
                    <button
                      onClick={() => handleRegenerate(s)}
                      disabled={generatingId === s.id}
                      className="mt-1 flex items-center gap-1 text-[10px] text-[#C9A96E] hover:text-[#4a0010] transition-colors disabled:opacity-50 w-fit"
                    >
                      {generatingId === s.id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Sparkles size={10} />
                      )}
                      {generatingId === s.id ? 'Generating...' : s.description ? 'Regenerate' : 'Generate with AI'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
