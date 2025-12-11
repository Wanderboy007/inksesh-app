"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Loader2,
  ChevronDown,
  X,
  SlidersHorizontal,
} from "lucide-react";
import {
  getDiscoverDesigns,
  getFilterOptions,
  type DiscoverDesign,
  type FilterOptions,
} from "./actions";

const formatText = (text: string) => text.toLowerCase().replace(/_/g, " ");

type DropdownProps = {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  color: "rose" | "blue" | "purple";
  linkMode?: boolean;
};

function FilterDropdown({
  label,
  options,
  selected,
  onSelect,
  color,
  linkMode,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colorStyles = {
    rose: {
      active: "bg-rose-600 border-rose-500 text-white",
      hover: "hover:bg-rose-500/20 hover:text-rose-300",
      ring: "ring-rose-500/30",
    },
    blue: {
      active: "bg-blue-600 border-blue-500 text-white",
      hover: "hover:bg-blue-500/20 hover:text-blue-300",
      ring: "ring-blue-500/30",
    },
    purple: {
      active: "bg-purple-600 border-purple-500 text-white",
      hover: "hover:bg-purple-500/20 hover:text-purple-300",
      ring: "ring-purple-500/30",
    },
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border
          ${
            selected
              ? colorStyles[color].active
              : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700"
          }
        `}
      >
        <span className="capitalize">
          {selected ? formatText(selected) : label}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-2 min-w-[160px] max-h-[280px] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50 py-1
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-neutral-700
          [&::-webkit-scrollbar-thumb]:rounded-full
        `}
        >
          {selected && (
            <button
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-800 hover:text-white flex items-center gap-2 border-b border-neutral-800"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
          {options.map((opt) =>
            linkMode ? (
              <Link
                key={opt}
                href={`/discover/${encodeURIComponent(
                  opt.toLowerCase().replace(/_/g, "-")
                )}`}
                className={`block w-full px-3 py-2 text-left text-sm capitalize transition-colors ${
                  colorStyles[color].hover
                } ${
                  selected === opt
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {formatText(opt)}
              </Link>
            ) : (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm capitalize transition-colors ${
                  colorStyles[color].hover
                } ${
                  selected === opt
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400"
                }`}
              >
                {formatText(opt)}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [designs, setDesigns] = useState<DiscoverDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );

  // Quick filter states (for in-page filtering)
  const [styleFilter, setStyleFilter] = useState<string | null>(null);
  const [styles, setStyles] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch filter options on mount
  useEffect(() => {
    getFilterOptions().then(setFilterOptions).catch(console.error);
  }, []);

  const fetchDesigns = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getDiscoverDesigns({
        category: styleFilter || "All",
        search: debouncedSearch,
      });
      setDesigns(result.designs);
      setTotal(result.total);
      // Extract unique styles for quick filtering
      if (result.categories.length > 2) {
        setStyles(
          result.categories.filter((c) => c !== "All" && c !== "Trending")
        );
      }
    } catch (error) {
      console.error("Failed to fetch designs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [styleFilter, debouncedSearch]);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  const hasActiveFilters = styleFilter || debouncedSearch;

  const clearAllFilters = () => {
    setStyleFilter(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-20">
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

      <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Filter Icon & Label */}
            <div className="flex items-center gap-2 text-neutral-400 shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">
                Filter by:
              </span>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Style/Theme Quick Filter (in-page) */}
              {styles.length > 0 && (
                <FilterDropdown
                  label="Style"
                  options={styles}
                  selected={styleFilter}
                  onSelect={setStyleFilter}
                  color="rose"
                />
              )}

              {/* Divider */}
              {filterOptions && (
                <div className="hidden sm:block w-px h-6 bg-neutral-800 mx-1" />
              )}

              {/* SEO Filter Links (navigate to dedicated pages) */}
              {filterOptions && (
                <>
                  <FilterDropdown
                    label="Gender"
                    options={filterOptions.genders}
                    selected={null}
                    onSelect={() => {}}
                    color="rose"
                    linkMode
                  />
                  <FilterDropdown
                    label="Size"
                    options={filterOptions.sizes}
                    selected={null}
                    onSelect={() => {}}
                    color="blue"
                    linkMode
                  />
                  <FilterDropdown
                    label="Body Part"
                    options={filterOptions.bodyParts}
                    selected={null}
                    onSelect={() => {}}
                    color="purple"
                    linkMode
                  />
                </>
              )}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-all ml-auto"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            )}
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-800/50">
              <span className="text-xs text-neutral-500">Active:</span>
              {styleFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full">
                  {formatText(styleFilter)}
                  <button
                    onClick={() => setStyleFilter(null)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-full">
                  &quot;{debouncedSearch}&quot;
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
        <p className="text-sm text-neutral-500">
          {isLoading
            ? "Loading..."
            : `Showing ${designs.length} of ${total} designs${
                styleFilter ? ` in "${styleFilter}"` : ""
              }${debouncedSearch ? ` matching "${debouncedSearch}"` : ""}`}
        </p>
      </div>

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
              onClick={clearAllFilters}
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
                <div className="relative w-full">
                  <Image
                    src={design.imageUrl}
                    alt={design.title}
                    width={500}
                    height={700}
                    className="w-full h-auto object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-black/70 md:from-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <h3 className="font-bold text-white text-xs md:text-base leading-tight line-clamp-2">
                      {design.title || "Untitled"}
                    </h3>

                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center text-[10px] font-bold text-white">
                        {design.artist.username[0].toUpperCase()}
                      </div>
                      <span className="text-[11px] md:text-xs text-neutral-300">
                        @{design.artist.username}
                      </span>
                    </div>

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
