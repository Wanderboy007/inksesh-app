"use client";

import { useState } from "react";
import { Check, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  permalink?: string;
}

interface SelectFromGalleryProps {
  images: GalleryImage[];
  onConfirm: (selectedIds: string[]) => void;
}

export function SelectFromGallery({
  images,
  onConfirm,
}: SelectFromGalleryProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_SELECTION = 20;

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= MAX_SELECTION) return prev;
      return [...prev, id];
    });
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    onConfirm(selectedIds);
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-neutral-500">
        <div className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-full mb-4">
          <ImageIcon className="h-8 w-8 text-neutral-400" />
        </div>
        <p>No images found in your gallery.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-32 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pt-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-neutral-900 dark:text-white">
            Select Your Best Work
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Tap the images you want to include in your portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800">
          <span
            className={`font-bold ${
              selectedIds.length === MAX_SELECTION
                ? "text-rose-600 dark:text-rose-400"
                : "text-neutral-900 dark:text-white"
            }`}
          >
            {selectedIds.length}
          </span>
          <span className="text-neutral-500">/ {MAX_SELECTION} selected</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {images.map((image) => {
          const isSelected = selectedIds.includes(image.id);

          return (
            <div
              key={image.id}
              onClick={() => toggleSelection(image.id)}
              className={`
                group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200
                ${
                  isSelected
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-900/10"
                    : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-100 dark:bg-neutral-900"
                }
              `}
            >
              <Image
                src={image.url}
                alt={image.caption || "Tattoo"}
                fill
                className={`object-cover transition-all duration-300 ${
                  isSelected
                    ? "opacity-60 scale-100 grayscale-[0.3]"
                    : "opacity-100 group-hover:scale-110"
                }`}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
              />

              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center z-10 animate-in zoom-in-50 duration-200">
                  <div className="bg-rose-600 text-white rounded-full p-3 shadow-lg shadow-rose-600/30">
                    <Check className="h-6 w-6" strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleConfirm}
            disabled={selectedIds.length === 0 || isSubmitting}
            className={`
              w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold shadow-xl transition-all duration-300
              ${
                selectedIds.length > 0
                  ? "bg-rose-600 hover:bg-rose-700 text-white translate-y-0 opacity-100"
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed translate-y-4 opacity-0 pointer-events-none"
              }
            `}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                Confirm Selection <Check className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
