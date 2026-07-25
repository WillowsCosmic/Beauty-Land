"use client";

import { useEffect, useState } from "react";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminVerify() {
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        // Check if the current URL is actually a magic link
        if (!isSignInWithEmailLink(auth, window.location.href)) {
          setErrorMsg("This link is invalid or has already been used.");
          setStatus("error");
          return;
        }

        // Get the email we saved in localStorage during login
        let email = window.localStorage.getItem("adminEmailForSignIn");

        if (!email) {
          // Fallback — ask the user to type it in
          email = window.prompt("Please enter your email to confirm sign-in:");
        }

        if (!email) {
          setErrorMsg("No email found. Please go back and log in again.");
          setStatus("error");
          return;
        }

        // Complete the sign-in with the magic link
        await signInWithEmailLink(auth, email, window.location.href);

        // Clean up localStorage
        window.localStorage.removeItem("adminEmailForSignIn");

        setStatus("success");

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.replace("/admin/dashboard/services");
        }, 1500);
      } catch (err: any) {
        console.error(err);
        setErrorMsg("Something went wrong. The link may have expired. Please log in again.");
        setStatus("error");
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a0005]">
      <div className="flex flex-col items-center gap-5 text-center px-6">

        {status === "verifying" && (
          <>
            {/* Spinner */}
            <div className="w-14 h-14 rounded-full border-4 border-[#C9A96E]/30 border-t-[#C9A96E] animate-spin" />
            <p className="text-white text-lg font-semibold">Verifying your link...</p>
            <p className="text-white/50 text-sm">Just a moment</p>
          </>
        )}

        {status === "success" && (
          <>
            {/* Checkmark */}
            <div className="w-16 h-16 rounded-full bg-[#C9A96E]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#C9A96E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-lg font-semibold">Verified! Welcome back </p>
            <p className="text-white/50 text-sm">Redirecting you to the dashboard...</p>
          </>
        )}

        {status === "error" && (
          <>
            {/* X mark */}
            <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-white text-lg font-semibold">Verification Failed</p>
            <p className="text-white/60 text-sm max-w-xs leading-relaxed">{errorMsg}</p>
            <button
              onClick={() => router.replace("/admin/login")}
              className="mt-2 bg-[#C0001A] hover:bg-[#e0001f] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 text-sm"
            >
              Back to Login
            </button>
          </>
        )}

      </div>
    </div>
  );
}
