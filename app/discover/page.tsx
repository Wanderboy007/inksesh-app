"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  Heart,
  TrendingUp,
  Sparkles,
  User,
} from "lucide-react";

// --- MOCK DATA ---
const CATEGORIES = [
  "All",
  "Trending",
  "Fine Line",
  "Traditional",
  "Realism",
  "Japanese",
  "Blackwork",
  "Geometric",
  "Portrait",
];

const DISCOVER_ITEMS = Array.from({ length: 24 }).map((_, i) => ({
  id: `post-${i}`,
  imageUrl: `https://placehold.co/${
    i % 2 === 0 ? "400x600" : "400x400"
  }/171717/FFF?text=Tattoo+${i + 1}`,
  title: `Design #${i + 1}`,
  artist: {
    name: "orange_santra",
    avatar: "U",
  },
  likes: Math.floor(Math.random() * 1000) + 50,
  isLiked: false,
}));

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState(DISCOVER_ITEMS);

  // --- TOGGLE LIKE ---
  const toggleLike = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isLiked: !item.isLiked,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1,
            }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20">
      {/* --- HERO SEARCH SECTION --- */}
      <section className="relative w-full py-12 md:py-20 px-4 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-rose-400 text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            <span>Explore 10,000+ Designs</span>
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
              <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-500 bg-neutral-800/50 px-2 py-1 rounded border border-neutral-700/50">
                <span className="font-sans">⌘</span>
                <span>K</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORY TABS --- */}
      <div className="sticky top-16 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-2 overflow-x-auto no-scrollbar mask-gradient-right">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
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

      {/* --- MASONRY GRID --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={500}
                  height={500}
                  className="w-full h-auto object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Interaction Overlay (Visible on Hover / Always visible on Mobile touch maybe) */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Top Right Actions */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(item.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-rose-600 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      item.isLiked ? "fill-white text-white" : "text-white"
                    }`}
                  />
                </button>

                {/* Bottom Info */}
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-white text-sm md:text-base">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold">
                        {item.artist.avatar}
                      </div>
                      <span className="text-xs text-neutral-300">
                        {item.artist.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-neutral-400">
                      <Heart className="w-3 h-3" />
                      {item.likes}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State / End of Feed */}
        <div className="mt-20 flex flex-col items-center justify-center text-neutral-500 space-y-4">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-800 border-t-rose-500 animate-spin" />
          <p className="text-sm">Loading more inspiration...</p>
        </div>
      </div>
    </div>
  );
}
