import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Cinzel } from 'next/font/google';
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-cinzel' });

export const metadata: Metadata = {
  title: "Beauty Land",
  description: "Beauty Land Salon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("h-full antialiased", geistSans.variable, geistMono.variable, cinzel.variable, inter.variable)}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}