"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Plus, Home, Image as ImageIcon } from "lucide-react";

export function ProfileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* --- LEFT: Logo / Home Link --- */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-80"
        >
          <div className="bg-rose-600/10 p-2 rounded-lg border border-rose-600/20 group-hover:border-rose-600/40 transition-colors">
            <Sparkles className="w-5 h-5 text-rose-500" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">
            InkSesh
          </span>
        </Link>

        {/* --- RIGHT: Actions --- */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Optional: Link back to Profile View if we are on the Generate page */}
          {pathname === "/profile/generate" && (
            <Link
              href="/profile"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Profile</span>
            </Link>
          )}

          {/* Add Image Button (Hidden if we are already on generate page) */}
          {pathname !== "/profile/profile-generator" && (
            <Link
              href="/profile/profile-generator"
              className="group flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.5)]"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>Add Design</span>
            </Link>
          )}

          {/* Mobile Profile Icon (Visual anchor) */}
          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center ml-2">
            <span className="text-xs font-bold text-white">U</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
