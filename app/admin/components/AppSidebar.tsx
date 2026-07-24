'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Scissors, Images, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GiTwirlyFlower } from "react-icons/gi";
import { useSidebar } from "@/components/ui/sidebar";
import { useState } from "react";

const navItems = [
  {
    label: "Services",
    icon: Scissors,
    href: "/admin/dashboard/services",
    children: [
      { label: "All Services", href: "/admin/dashboard/services" },
      { label: "Add Service", href: "/admin/dashboard/services/add" },
    ],
  },
  {
    label: "Gallery",
    icon: Images,
    href: "/admin/dashboard/gallery",
    children: [
      { label: "All Photos", href: "/admin/dashboard/gallery" },
      
    ],
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  // Track which parent menus are open
  const [openMenus, setOpenMenus] = useState<string[]>(() =>
    // Auto-open the menu whose child is currently active
    navItems.filter((item) => pathname.startsWith(item.href)).map((item) => item.href)
  );

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  return (
    <Sidebar className="border-r border-[#3a0010] bg-[#7a0020] overflow-hidden">
      {/* Logo */}
      <SidebarHeader className="px-5 py-5 border-b border-white/10">
        <div className="font-cinzel font-bold text-xl flex items-center gap-2 text-white tracking-wide">
          <GiTwirlyFlower className="text-[#C9A96E]" />
          BeautyLand
        </div>
        <p className="text-[10px] text-white/40 mt-0.5 tracking-widest uppercase font-medium pl-0.5">
          Admin Portal
        </p>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="mt-4 px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold px-2 mb-2">
              Manage
            </p>
            <SidebarMenu className="gap-2">
              {navItems.map(({ label, icon: Icon, href, children }) => {
                const isOpen = openMenus.includes(href);
                const isParentActive = pathname.startsWith(href);

                return (
                  <SidebarMenuItem key={href} className="w-full max-w-full">
                    {/* Parent item — toggles submenu */}
                    <button
                      onClick={() => toggleMenu(href)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xs text-sm font-medium transition-colors ${
                        isParentActive
                          ? "text-[#7a0020] font-semibold bg-white "
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="flex-1 text-left">{label}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Submenu */}
                    {isOpen && (
                      <ul className="mt-2 ml-6 border-l border-white/20 pl-3 flex flex-col gap-1.5">
                        {children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpenMobile(false)}
                              className={`block px-2 py-1.5 text-xs font-medium transition-colors ${
                                pathname === child.href
                                  ? "text-[#C9A96E] font-semibold"
                                  : "text-white/50 hover:text-[#C9A96E] hover:bg-white/5"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
