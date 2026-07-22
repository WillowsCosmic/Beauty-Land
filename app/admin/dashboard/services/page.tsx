"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState([
    { id: "1", name: "Haircut", price: "500" },
    { id: "2", name: "Facial", price: "800" },
  ]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!name || !price) return;
    if (editId) {
      setServices(services.map((s) => (s.id === editId ? { id: editId, name, price } : s)));
      setEditId(null);
    } else {
      setServices([...services, { id: Date.now().toString(), name, price }]);
    }
    setName("");
    setPrice("");
  };

  const handleEdit = (s: { id: string; name: string; price: string }) => {
    setEditId(s.id);
    setName(s.name);
    setPrice(s.price);
  };

  const handleDelete = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-[#4a0010] mb-6 font-cinzel">Services</h2>

      {/* Add / Edit Form */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Service name"
          className="flex-1 border border-[#C9A96E]/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001A]/30"
        />
        <div className="flex gap-3">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price (₹)"
            className="flex-1 sm:w-32 border border-[#C9A96E]/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C0001A]/30"
          />
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-[#C0001A] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#4a0010] transition-colors whitespace-nowrap"
          >
            <Plus size={16} />
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {services.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between bg-white border border-[#C9A96E]/30 rounded-xl px-5 py-3 shadow-sm"
          >
            <div>
              <p className="font-semibold text-[#4a0010]">{s.name}</p>
              <p className="text-sm text-[#C9A96E]">₹{s.price}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(s)}
                className="text-[#C9A96E] hover:text-[#4a0010] transition-colors"
              >
                <Pencil size={17} />
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="text-[#C9A96E] hover:text-[#C0001A] transition-colors"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <p className="text-sm text-[#C9A96E] text-center py-8">No services yet. Add one above!</p>
        )}
      </div>
    </div>
  );
}
