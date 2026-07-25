"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // No user logged in → back to login
        router.replace("/admin/login");
        return;
      }

      // Get the ID token and read custom claims
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role;

      if (role === "admin") {
        setAuthorized(true);
      } else {
        // Logged in but NOT an admin → sign them out and redirect
        await auth.signOut();
        router.replace("/admin/login");
      }

      setChecking(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Still verifying — show a subtle fullscreen loader
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0005]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#C9A96E]/30 border-t-[#C9A96E] rounded-full animate-spin" />
          <p className="text-[#C9A96E] text-sm tracking-widest uppercase">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authorized — render nothing (redirect is already happening)
  if (!authorized) return null;

  // All good — render the protected page
  return <>{children}</>;
}
