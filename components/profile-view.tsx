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
import { updateDesign } from "@/app/designs/actions";

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
  const [designs, setDesigns] = useState<Design[]>(user.designs);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
            // 👇 Added Caption Update Logic
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
      <header className="relative w-full h-64 bg-gradient-to-b from-neutral-900 to-neutral-950 border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-8 relative z-10">
          <div className="flex items-end gap-6">
            <div className="w-24 h-24 rounded-full bg-neutral-800 border-4 border-neutral-950 overflow-hidden shadow-2xl relative">
              <div className="w-full h-full flex items-center justify-center bg-rose-600 text-3xl font-bold">
                {user.username?.[0]?.toUpperCase() || "U"}
              </div>
            </div>
            <div className="mb-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {user.username || "Tattoo Artist"}
              </h1>
              <div className="flex items-center gap-4 text-sm text-neutral-400 mt-2">
                <a
                  href={user.profileUrl || "#"}
                  target="_blank"
                  className="flex items-center gap-1 hover:text-rose-400 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@{user.username || "artist"}</span>
                </a>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Trivandrum, India</span>
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-4 h-4" />
                  <span>{designs.length} Designs</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- FILTER BAR --- */}
      <div className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-md border-b border-white/5 py-4 px-6 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
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
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
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
              className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* --- GRID --- */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="mb-6 text-sm text-neutral-500">
          Showing {filteredDesigns.length}{" "}
          {activeFilter ? `"${activeFilter}"` : ""} designs
        </div>

        {filteredDesigns.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800 border-dashed">
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
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="break-inside-avoid bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-rose-500/50 transition-all group relative"
              >
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={design.imageUrl}
                    alt={design.title}
                    width={500}
                    height={700}
                    className="w-full h-auto object-cover"
                  />

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingDesign(design);
                      }}
                      className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <h3 className="text-white font-bold text-lg leading-tight">
                      {design.title || "Untitled"}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-3">
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
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setEditingDesign(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-6">Edit Tattoo Details</h2>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title Field */}
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

              {/* 👇 NEW: Caption Field */}
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

              {/* Styles Field */}
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

              {/* Themes Field */}
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

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingDesign(null)}
                  className="px-4 py-2 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center gap-2 font-medium"
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
