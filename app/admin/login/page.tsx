"use client";

import { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";


function GoldSparks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        speedY: -(Math.random() * 0.6 + 0.2),
        speedX: (Math.random() - 0.5) * 0.3,
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
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: "#4a0010" }}>
      <GoldSparks />

      <div className="relative z-10 bg-[#1c1c1c] border border-[#C9A96E]/50 rounded-2xl p-10 w-full max-w-md shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/60 transition-all duration-200">
        
        {/* Logo / Title */}
        <div className="text-center flex flex-col items-center justify-between mb-8">
          <img
            src="/Beauty-Hair.png"
            alt="Beauty Hair Logo"
            width={80}
            height={80}
          />
          <h1 className="text-3xl font-bold text-white mb-1 font-cinzel">Beauty Land</h1>
          <p className="text-[#C9A96E] text-sm tracking-widest uppercase font-cinzel">Admin Panel</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-1">
            <label className="text-white/70 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@beautyland.com"
              className="bg-white/10 text-white placeholder-white/30 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-[#C9A96E] transition"
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
              className="bg-white/10 text-white placeholder-white/30 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-[#C9A96E] transition"
            />
          </div>

          {error && (
            <p className="text-[#C0001A] text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#C0001A] hover:bg-[#a0001a] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}