"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, TrendingUp, Sparkles, Loader2 } from "lucide-react";
import { getDiscoverDesigns, type DiscoverDesign } from "./actions";

const formatText = (text: string) => text.toLowerCase().replace(/_/g, " ");

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [designs, setDesigns] = useState<DiscoverDesign[]>([]);
  const [categories, setCategories] = useState<string[]>(["All", "Trending"]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchDesigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getDiscoverDesigns({
        category: activeCategory,
        search: debouncedSearch,
      });
      setDesigns(result.designs);
      setTotal(result.total);
      if (result.categories.length > 2) {
        setCategories(result.categories);
      }
    } catch (error) {
      console.error("Failed to fetch designs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, debouncedSearch]);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20">
      {/* --- HERO SEARCH SECTION --- */}
      <section className="relative w-full py-12 md:py-20 px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-rose-400 text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            <span>Explore {total > 0 ? `${total}+` : ""} Designs</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Find Your Next <span className="text-rose-500">Ink</span>
          </h1>

          <p className="text-neutral-400 text-sm md:text-base max-w-lg mx-auto">
            Search by style, artist, or body placement to find the perfect
            inspiration.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-full px-4 py-3 shadow-2xl focus-within:border-rose-500/50 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
              <Search className="w-5 h-5 text-neutral-500 mr-3" />
              <input
                type="text"
                placeholder="Search 'snake forearm' or 'traditional'..."
                className="bg-transparent border-none outline-none text-white w-full placeholder-neutral-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isLoading && (
                <Loader2 className="w-4 h-4 text-neutral-500 animate-spin" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORY TABS --- */}
      <div className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-white/5 py-4">
        <div
          className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-2 overflow-x-auto pb-2
          [&::-webkit-scrollbar]:h-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-neutral-800
          [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0
                ${
                  activeCategory === cat
                    ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-900/20"
                    : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
                }
              `}
            >
              {cat === "Trending" && <TrendingUp className="w-3 h-3" />}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- RESULTS INFO --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
        <p className="text-sm text-neutral-500">
          {isLoading
            ? "Loading..."
            : `Showing ${designs.length} of ${total} designs${
                activeCategory !== "All" ? ` in "${activeCategory}"` : ""
              }${debouncedSearch ? ` matching "${debouncedSearch}"` : ""}`}
        </p>
      </div>

      {/* --- MASONRY GRID --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            <p className="text-sm">Loading designs...</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800 border-dashed">
            <Search className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-500">No designs found.</p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchQuery("");
              }}
              className="text-rose-500 hover:underline mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
            {designs.map((design) => (
              <Link
                key={design.id}
                href={`/artist/${design.artist.username}`}
                className="break-inside-avoid group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 transition-all duration-300 block mb-3 md:mb-4"
              >
                {/* Image */}
                <div className="relative w-full">
                  <Image
                    src={design.imageUrl}
                    alt={design.title}
                    width={500}
                    height={700}
                    className="w-full h-auto object-cover"
                  />

                  {/* Overlay - Always visible on mobile, hover on desktop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-black/70 md:from-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    {/* Title */}
                    <h3 className="font-bold text-white text-xs md:text-base leading-tight line-clamp-2">
                      {design.title || "Untitled"}
                    </h3>

                    {/* Artist */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-[10px] font-bold text-white">
                        {design.artist.username[0].toUpperCase()}
                      </div>
                      <span className="text-[11px] md:text-xs text-neutral-300">
                        @{design.artist.username}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2 text-[8px] md:text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 capitalize">
                        {formatText(design.gender)}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 capitalize">
                        {formatText(design.size)}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize truncate max-w-[60px] md:max-w-none">
                        {design.bodyPart}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
