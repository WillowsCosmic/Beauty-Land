"use client";

import Link from "next/link";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { RiFacebookCircleLine } from "react-icons/ri";
const OWNER_PHONE = "+918240488414";
const WHATSAPP_LINK = `https://wa.me/${OWNER_PHONE.replace("+", "")}`;
const CALL_LINK = `tel:${OWNER_PHONE}`;

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative bg-[#1a0005] text-[#e8d9c5] pt-16 pb-8 px-6 md:px-12 overflow-hidden">
            {/* subtle top border accent */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent" />

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 md:gap-8">
                {/* Brand */}
                <div className="md:col-span-2">
                    <Link href="/admin/login">
                        <h2 className="font-cinzel text-2xl tracking-wide text-[#C9A96E]">
                            Beauty Land
                        </h2>
                    </Link>
                    <p className="mt-3 text-sm leading-relaxed text-[#e8d9c5]/70 max-w-sm">
                        A haven of elegance and care — where every visit is crafted into
                        an experience of beauty, calm, and confidence.
                    </p>

                    <div className="flex items-center gap-4 mt-6">
                        <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-[#25D366]/10 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/20 transition"
                        >
                            <MessageCircle size={16} />
                            WhatsApp
                        </a>
                        <a
                            href={CALL_LINK}
                            className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-[#C9A96E]/40 text-[#C9A96E] hover:bg-[#C9A96E]/10 transition"
                        >
                            <Phone size={16} />
                            Call Us
                        </a>
                    </div>
                </div>


                {/* Contact */}
                <div>
                    <h3 className="font-cinzel text-sm tracking-widest text-[#C9A96E] uppercase mb-4">
                        Contact
                    </h3>
                    <ul className="space-y-3 text-sm text-[#e8d9c5]/70">
                        <li className="flex items-start gap-2">
                            <Phone size={15} className="mt-0.5 shrink-0 text-[#C9A96E]" />
                            <a href={CALL_LINK} className="hover:text-[#C9A96E] transition">
                                +91 82404 88414
                            </a>
                        </li>
                        <li className="flex items-start gap-2">
                            <MapPin size={15} className="mt-0.5 shrink-0 text-[#C9A96E]" />
                            <span>1/1,D.D. Mondal Ghat road,Dakshineswar,Kolkata-700076</span>
                        </li>
                    </ul>

                    <div className="flex items-center gap-3 mt-5">
                        <a
                            href="#"
                            aria-label="Instagram"
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#C9A96E]/30 text-[#C9A96E] hover:bg-[#C9A96E]/10 transition"
                        >
                            <FaInstagram size={15} />
                        </a>
                        <a
                            href="#"
                            aria-label="Facebook"
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#C9A96E]/30 text-[#C9A96E] hover:bg-[#C9A96E]/10 transition"
                        >
                            <RiFacebookCircleLine size={15} />
                        </a>
                    </div>
                </div>
            </div>

            {/* bottom bar */}
            <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-[#C9A96E]/15 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#e8d9c5]/40">
                    © {year} Beauty Land. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
