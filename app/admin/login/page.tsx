"use client";

import { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: any[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.5 + 0.2,
        opacity: Math.random(),
        flicker: Math.random() * 0.02 + 0.005,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.opacity += p.flicker;
        if (p.opacity > 1 || p.opacity < 0) p.flicker *= -1;
        p.y -= p.speedY;
        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a0005]">
      <div className="flex w-full max-w-4xl min-h-[520px] rounded-2xl overflow-hidden shadow-2xl shadow-amber-900/40">
        
        {/* LEFT — salon image */}
        <div className="hidden md:block relative w-1/2">
          <img
            src="/salon-bg.jpg"
            alt="Salon"
            className="w-full h-full object-cover"
          />
          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
          {/* centered logo + tagline */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
            <img src="/Beauty-Hair.png" alt="Logo" width={90} height={90} />
            <h1 className="text-4xl font-bold text-white font-cinzel">Beauty Land</h1>
            <p className="text-[#C9A96E] text-sm tracking-widest uppercase">Where Beauty Meets Elegance</p>
          </div>
        </div>

        {/* RIGHT — form with wine red + gold sparks */}
        <div className="relative w-full md:w-1/2 bg-[#4a0010] flex items-center justify-center p-10 overflow-hidden">
          {/* sparks canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* form card */}
          <div className="relative z-10 w-full max-w-sm">
            {/* mobile only logo */}
            <div className="flex flex-col items-center mb-6 md:hidden">
              <img src="/Beauty-Hair.png" alt="Logo" width={60} height={60} />
              <h1 className="text-2xl font-bold text-white">Beauty Land</h1>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-[#C9A96E] text-sm tracking-widest uppercase mb-8">Admin Panel</p>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-sm">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@beautyland.com"
                  className="bg-white/10 text-white placeholder-white/30 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#C9A96E] hover:border-[#C9A96E]/60 hover:bg-white/15 transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-white/70 text-sm">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="bg-white/10 text-white placeholder-white/30 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#C9A96E] hover:border-[#C9A96E]/60 hover:bg-white/15 transition-all duration-200"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-[#C0001A] hover:bg-[#e0001f] active:scale-95 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-900/50 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
