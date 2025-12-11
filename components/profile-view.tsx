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
  Trash2,
} from "lucide-react";
import { updateDesign } from "@/app/profile/actions";
import { deleteDesign } from "@/app/profile/_edit-actions/delete-design-profile";

type Design = {
  id: string;
  imageUrl: string;
  title: string;
  caption: string | null;
  gender: string;
  size: string;
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
  const [isDeleting, setIsDeleting] = useState(false);

  const headerImage = designs.length > 0 ? designs[0].imageUrl : null;

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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDesign) return;
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);

    const updatedDesigns = designs.map((d) =>
      d.id === editingDesign.id
        ? {
            ...d,
            title: formData.get("title") as string,
            caption: formData.get("caption") as string,
            gender: formData.get("gender") as string,
            size: formData.get("size") as string,
            bodyPart: formData.get("bodyPart") as string,
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

    await updateDesign(editingDesign.id, formData);

    setIsSaving(false);
    setEditingDesign(null);
  };

  const handleDelete = async () => {
    if (!editingDesign) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this design? This action cannot be undone."
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const remainingDesigns = designs.filter((d) => d.id !== editingDesign.id);
      setDesigns(remainingDesigns);
      setEditingDesign(null);
      await deleteDesign(editingDesign.id);
    } catch (error) {
      console.error("Error deleting design:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20 relative">
      <header className="relative w-full h-56 md:h-80 border-b border-white/5 overflow-hidden transition-all duration-500">
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

      <div className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-xl border-b border-white/5 py-2 md:py-4 px-4 md:px-6 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            className="flex gap-2 overflow-x-auto pb-2 w-full
            [&::-webkit-scrollbar]:h-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-neutral-800
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:hover:bg-neutral-700"
          >
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all border flex-shrink-0 ${
                activeFilter === null
                  ? "bg-white text-neutral-950 border-white"
                  : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
              }`}
            >
              All Work
            </button>
            {uniqueTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all border flex-shrink-0 ${
                  activeFilter === tag
                    ? "bg-rose-600 border-rose-600 text-white"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {activeFilter && (
            <button
              onClick={() => setActiveFilter(null)}
              className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 text-white shrink-0 transition-colors mb-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 md:px-6 mt-6 md:mt-8">
        <div className="mb-4 md:mb-6 px-2 text-xs md:text-sm text-neutral-500 font-medium">
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
          <div className="columns-2 md:columns-3 lg:columns-4 gap-2 md:gap-4 space-y-2 md:space-y-4">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="break-inside-avoid bg-neutral-900 rounded-lg md:rounded-xl overflow-hidden border border-neutral-800 hover:border-rose-500/50 transition-all group relative mb-2 md:mb-4 shadow-lg shadow-black/20"
              >
                <div className="relative w-full">
                  <Image
                    src={design.imageUrl}
                    alt={design.title}
                    width={500}
                    height={700}
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-black/60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 md:p-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingDesign(design);
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/40 md:bg-white/10 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-colors"
                    >
                      <Pencil className="w-3 h-3 md:w-4 md:h-4" />
                    </button>

                    <h3 className="text-white font-bold text-xs md:text-lg leading-tight truncate md:whitespace-normal drop-shadow-md">
                      {design.title || "Untitled"}
                    </h3>

                    <div className="flex flex-col gap-1.5 md:gap-2 mt-1.5 md:mt-3">
                      <div className="flex flex-wrap gap-1 md:gap-1.5">
                        {[...design.styles, ...design.themes]
                          .slice(0, 2)
                          .map((t) => (
                            <span
                              key={t}
                              className="text-[8px] md:text-[10px] uppercase font-bold tracking-wide bg-white/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-white border border-white/10"
                            >
                              {t}
                            </span>
                          ))}
                        {[...design.styles, ...design.themes].length > 2 && (
                          <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-wide bg-white/10 px-1.5 md:px-2 py-0.5 md:py-1 rounded text-white/60 border border-white/10">
                            +{[...design.styles, ...design.themes].length - 2}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 md:gap-1.5 text-[8px] md:text-[10px] uppercase font-semibold">
                        <span className="bg-rose-600/20 text-rose-300 px-1.5 md:px-2 py-0.5 md:py-1 rounded border border-rose-500/20">
                          {design.gender}
                        </span>
                        <span className="bg-blue-600/20 text-blue-300 px-1.5 md:px-2 py-0.5 md:py-1 rounded border border-blue-500/20">
                          {design.size.replace("_", " ")}
                        </span>
                        <span className="bg-purple-600/20 text-purple-300 px-1.5 md:px-2 py-0.5 md:py-1 rounded border border-purple-500/20 truncate max-w-[80px] md:max-w-none">
                          {design.bodyPart || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-track]:my-4
            [&::-webkit-scrollbar-thumb]:bg-neutral-800
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:hover:bg-neutral-700"
          >
            <button
              onClick={() => setEditingDesign(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white p-2 hover:bg-neutral-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-1 text-white">Edit Details</h2>
            <p className="text-neutral-500 text-sm mb-6">
              Update information for this design.
            </p>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 block">
                  Title
                </label>
                <input
                  name="title"
                  defaultValue={editingDesign.title}
                  placeholder="e.g. Traditional Snake"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-neutral-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 block">
                  Caption
                </label>
                <textarea
                  name="caption"
                  defaultValue={editingDesign.caption || ""}
                  placeholder="Describe the tattoo..."
                  rows={3}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all resize-none placeholder:text-neutral-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 block">
                  Styles (Comma separated)
                </label>
                <input
                  name="styles"
                  defaultValue={editingDesign.styles.join(", ")}
                  placeholder="Realism, Blackwork, Fine Line"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-neutral-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 block">
                  Themes (Comma separated)
                </label>
                <input
                  name="themes"
                  defaultValue={editingDesign.themes.join(", ")}
                  placeholder="Nature, Skull, Floral"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-neutral-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 block">
                    Gender
                  </label>
                  <select
                    name="gender"
                    defaultValue={editingDesign.gender}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="UNISEX">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 block">
                    Size
                  </label>
                  <select
                    name="size"
                    defaultValue={editingDesign.size}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="SMALL">Small</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LARGE">Large</option>
                    <option value="EXTRA_LARGE">Extra Large</option>
                    <option value="FULL_COVERAGE">Full Coverage</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 block">
                    Body Part
                  </label>
                  <input
                    name="bodyPart"
                    defaultValue={editingDesign.bodyPart}
                    placeholder="e.g. Forearm, Back"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all placeholder:text-neutral-600"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center gap-4 mt-8 pt-6 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting || isSaving}
                  className="w-full sm:w-auto px-4 py-2.5 text-rose-500 hover:bg-rose-950/30 hover:text-rose-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setEditingDesign(null)}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || isDeleting}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg flex items-center justify-center gap-2 font-medium text-sm transition-all shadow-lg shadow-rose-900/20"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
