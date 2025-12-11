"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Plus, Home } from "lucide-react";
import { secureStorage } from "@/lib/secure-storage";
import { getUserById } from "@/lib/get-user-info";
import { useEffect, useState } from "react";
import { ProfileEditDialog } from "@/components/profile-edit-dialog";

export function ProfileNavbar() {
  const pathname = usePathname();

  const [id, setId] = useState<string>("");
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [userInfo, setUserInfo] = useState({
    id: "",
    username: "",
    profileUrl: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const storedId = secureStorage.getItem("c_uid");

      if (storedId) {
        setId(storedId);
        const result = await getUserById(storedId);

        if (result.success && result.user) {
          setProfileUrl(result.user.profileUrl || "");

          setUserInfo({
            id: result.user.id,
            username: result.user.username || "",
            profileUrl: result.user.profileUrl || "",
          });
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
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

          <div className="flex items-center gap-3 md:gap-4">
            {pathname === "/profile/generate" && (
              <Link
                href="/profile"
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Profile</span>
              </Link>
            )}

            {pathname !== "/profile/profile-generator" && (
              <Link
                href={`/profile/profile-generator?userId=${id}&instagramUrl=${encodeURIComponent(
                  profileUrl
                )}`}
                className="group flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.5)]"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                <span>Add Design</span>
              </Link>
            )}

            <button
              onClick={() => setIsEditOpen(true)}
              className="relative group outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 group-active:scale-95 group-focus:ring-2 group-focus:ring-rose-500/50">
                <span className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                  {profileUrl
                    ? profileUrl[0].toUpperCase()
                    : userInfo.username
                    ? userInfo.username[0].toUpperCase()
                    : "U"}
                </span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      <ProfileEditDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        userId={userInfo.id}
        initialData={{
          username: userInfo.username,
          instagramUrl: userInfo.profileUrl || "",
        }}
      />
    </>
  );
}
