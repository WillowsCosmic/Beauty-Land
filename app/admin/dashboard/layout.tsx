import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "../components/AppSidebar";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SidebarProvider>
      <Toaster richColors position="top-right" />
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#f8f8f8]">
        <header className="flex items-center gap-4 px-6 py-3 border-b border-[#7a0020]/20 bg-white shadow-sm">
          <SidebarTrigger className="text-[#7a0020]" />

          {/* Date */}
          <span className="text-xs text-gray-400 font-medium hidden sm:block">{today}</span>

          <div className="flex-1" />

          

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200" />

          {/* User avatar + name */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#7a0020] text-white text-sm font-semibold flex items-center justify-center font-cinzel">
              M
            </div>
            <span className="text-sm font-medium text-[#3a0010] hidden sm:block">Mistu</span>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200" />

          {/* Logout */}
          <Link
            href="/admin/login"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-[#7a0020] transition-colors"
          >
            <LogOut size={15} />
            <span className="hidden sm:block">Logout</span>
          </Link>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
