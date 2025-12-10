"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Instagram,
  MapPin,
  Layers,
  Filter,
  X,
  Pencil,
  Save,
  Loader2,
} from "lucide-react";
import { updateDesign } from "@/app/profile/actions";

// --- TYPES ---
type Design = {
  id: string;
  imageUrl: string;
  title: string;
  caption: string | null;
  gender: string;
  bodyPart: string;
  styles: string[];
  themes: string[];
};

type UserProfile = {
  id: string;
  username: string | null;
  profileUrl: string | null;
  designs: Design[];
};

export function ProfileView({ user }: { user: UserProfile }) {
  const [designs, setDesigns] = useState<Design[]>(user?.designs);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- DYNAMIC HEADER IMAGE ---
  const headerImage = designs.length > 0 ? designs[0].imageUrl : null;

  // --- FILTER LOGIC ---
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    designs.forEach((d) => {
      d.styles.forEach((s) => tags.add(s));
      d.themes.forEach((t) => tags.add(t));
    });
    return Array.from(tags).sort();
  }, [designs]);

  const filteredDesigns = useMemo(() => {
    if (!activeFilter) return designs;
    return designs.filter(
      (d) => d.styles.includes(activeFilter) || d.themes.includes(activeFilter)
    );
  }, [designs, activeFilter]);

  // --- SAVE HANDLER ---
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDesign) return;
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);

    // Optimistic Update
    const updatedDesigns = designs.map((d) =>
      d.id === editingDesign.id
        ? {
            ...d,
            title: formData.get("title") as string,
            caption: formData.get("caption") as string,
            styles: (formData.get("styles") as string)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            themes: (formData.get("themes") as string)
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          }
        : d
    );
    setDesigns(updatedDesigns);

    // Call Server
    await updateDesign(editingDesign.id, formData);

    setIsSaving(false);
    setEditingDesign(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20 relative">
      {/* --- HERO HEADER --- */}
      <header className="relative w-full h-56 md:h-80 border-b border-white/5 overflow-hidden transition-all duration-500">
        {/* 1. Dynamic Background Layer */}
        {headerImage ? (
          <>
            <Image
              src={headerImage}
              alt="Profile Mood Background"
              fill
              className="object-cover blur-[60px] md:blur-[100px] opacity-60 scale-125"
              priority
            />
            <div className="absolute inset-0 bg-neutral-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-neutral-950" />
        )}

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

        {/* 4. Header Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex flex-col justify-end pb-6 md:pb-8 relative z-10">
          <div className="flex items-end gap-4 md:gap-8">
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-neutral-800 border-4 border-neutral-950 overflow-hidden shadow-2xl relative flex-shrink-0">
              <div className="w-full h-full flex items-center justify-center bg-rose-600 text-2xl md:text-4xl font-bold">
                {user.username?.[0]?.toUpperCase() || "U"}
              </div>
            </div>

            <div className="mb-1 md:mb-3 flex-1 min-w-0">
              <h1 className="text-2xl md:text-5xl font-bold tracking-tight drop-shadow-md truncate">
                {user.username || "Tattoo Artist"}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-neutral-300 mt-1 md:mt-2 font-medium drop-shadow-sm">
                {user.profileUrl ? (
                  <a
                    href={user.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Instagram className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="truncate max-w-[150px] md:max-w-none">
                      @{user.username || "artist"}
                    </span>
                  </a>
                ) : (
                  <div className="flex items-center gap-1 opacity-50 cursor-not-allowed">
                    <Instagram className="w-3 h-3 md:w-4 md:h-4" />
                    <span>@{user.username || "artist"}</span>
                  </div>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Trivandrum, India</span>
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 md:w-4 md:h-4" />
                  <span>{designs.length} Designs</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- FILTER BAR --- */}
      <div className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-md border-b border-white/5 py-3 md:py-4 px-4 md:px-6 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-gradient-right">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === null
                  ? "bg-white text-black"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              All Work
            </button>
            {uniqueTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === tag
                    ? "bg-rose-600 text-white"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="p-1.5 md:p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 text-white flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* --- GRID --- */}
      <div className="max-w-7xl mx-auto px-2 md:px-6 mt-4 md:mt-8">
        <div className="mb-4 md:mb-6 px-2 text-xs md:text-sm text-neutral-500">
          Showing {filteredDesigns.length}{" "}
          {activeFilter ? `"${activeFilter}"` : ""} designs
        </div>

        {filteredDesigns.length === 0 ? (
          <div className="mx-2 text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800 border-dashed">
            <Filter className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
            <p className="text-neutral-500">No designs match this filter.</p>
            <button
              onClick={() => setActiveFilter(null)}
              className="text-rose-500 hover:underline mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* UPDATED GRID:
             - columns-2 on mobile (gap-2)
             - columns-3 on tablet
             - columns-4 on desktop (gap-4)
          */
          <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-4 space-y-2 md:space-y-4">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="break-inside-avoid bg-neutral-900 rounded-lg md:rounded-xl overflow-hidden border border-neutral-800 hover:border-rose-500/50 transition-all group relative mb-2 md:mb-4"
              >
                <div className="relative w-full">
                  <Image
                    src={design.imageUrl}
                    alt={design.title}
                    width={500}
                    height={700}
                    className="w-full h-auto object-cover"
                  />

                  {/* Overlay: Subtle on mobile, full on desktop hover */}
                  <div className="absolute inset-0 bg-black/20 md:bg-black/60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2 md:p-4">
                    {/* Edit Button: Smaller on mobile */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingDesign(design);
                      }}
                      className="absolute top-2 right-2 p-1.5 md:p-2 bg-black/40 md:bg-white/10 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                      <Pencil className="w-3 h-3 md:w-4 md:h-4" />
                    </button>

                    <h3 className="text-white font-bold text-xs md:text-lg leading-tight truncate md:whitespace-normal drop-shadow-md">
                      {design.title || "Untitled"}
                    </h3>

                    {/* Tags: Hidden on Mobile to save space, visible on Desktop */}
                    <div className="hidden md:flex flex-wrap gap-1.5 mt-3">
                      {[...design.styles, ...design.themes]
                        .slice(0, 3)
                        .map((t) => (
                          <span
                            key={t}
                            className="text-[10px] uppercase font-bold tracking-wide bg-white/10 px-2 py-1 rounded text-white border border-white/10"
                          >
                            {t}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- EDIT MODAL --- */}
      {editingDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingDesign(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-6">Edit Tattoo Details</h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Title
                </label>
                <input
                  name="title"
                  defaultValue={editingDesign.title}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-rose-500 outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Caption
                </label>
                <textarea
                  name="caption"
                  defaultValue={editingDesign.caption || ""}
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-rose-500 outline-none mt-1 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Styles (Comma separated)
                </label>
                <input
                  name="styles"
                  defaultValue={editingDesign.styles.join(", ")}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-rose-500 outline-none mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Themes (Comma separated)
                </label>
                <input
                  name="themes"
                  defaultValue={editingDesign.themes.join(", ")}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:border-rose-500 outline-none mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingDesign(null)}
                  className="px-4 py-2 text-neutral-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-2 font-medium text-sm"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
