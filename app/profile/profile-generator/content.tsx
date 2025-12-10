"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SelectFromGallery,
  GalleryImage,
} from "@/components/select-from-gallery";
import { Loader2, Sparkles } from "lucide-react";
import { uploadAndSaveSelectedImages } from "./actions";

export default function Step2SelectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const instagramUrl = searchParams.get("instagramUrl") || "";

  const [posts, setPosts] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing. Please go back and try again.");
      setLoading(false);
      return;
    }

    async function fetchInstagram() {
      try {
        const res = await fetch("/api/instagram/fetch-media", {
          method: "POST",
          body: JSON.stringify({
            inputUrl: instagramUrl,
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch Instagram posts");

        const data: {
          posts?: Array<{
            id: string;
            url: string;
            caption?: string;
            permalink?: string;
          }>;
        } = await res.json();

        if (data.posts && Array.isArray(data.posts)) {
          const formatted = data.posts.map((p) => ({
            id: p.id,
            url: p.url,
            caption: p.caption,
            permalink: p.permalink,
          }));
          setPosts(formatted);
        } else {
          setError("No posts found. Please check the Instagram profile.");
        }
      } catch (e) {
        console.error("Fetch failed", e);
        setError(e instanceof Error ? e.message : "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    }

    fetchInstagram();
  }, [userId, instagramUrl]);

  const handleSelectionConfirmed = async (selectedIds: string[]) => {
    if (!userId) {
      alert("User ID missing. Please restart.");
      return;
    }

    setIsUploading(true);

    const selectedImages = posts.filter((p) => selectedIds.includes(p.id));

    const imagesPayload = selectedImages.map((p) => ({
      id: p.id,
      url: p.url,
      permalink: p.permalink,
    }));

    try {
      // 1. Upload Images
      const result = await uploadAndSaveSelectedImages(userId, imagesPayload);

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      // --- PHASE 2: SUCCESS ---
      setIsUploading(false);
      setIsAnalyzing(true);

      // Small delay to show success message
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsAnalyzing(false);
      if (result.redirectUrl) {
        router.push(result.redirectUrl);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      console.error("Process Error:", errorMsg);
      alert(`Error: ${errorMsg}`);
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-950 text-white">
        <Loader2 className="animate-spin mr-2" /> Fetching...
      </div>
    );

  if (isUploading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-neutral-950 text-white gap-4">
        <Loader2 className="animate-spin w-12 h-12 text-rose-600" />
        <span className="text-lg">Uploading to secure storage...</span>
      </div>
    );

  if (isAnalyzing)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-neutral-950 text-white gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-rose-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <Sparkles className="w-12 h-12 text-rose-400 animate-bounce relative z-10" />
        </div>
        <span className="text-lg bg-clip-text text-transparent bg-linear-to-r from-rose-400 to-white">
          Analyzing Tattoos...
        </span>
        <p className="text-neutral-500 text-sm">
          Detecting styles, themes, and body parts.
        </p>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  return (
    <main className="min-h-screen bg-neutral-950 p-6">
      <SelectFromGallery images={posts} onConfirm={handleSelectionConfirmed} />
    </main>
  );
}
