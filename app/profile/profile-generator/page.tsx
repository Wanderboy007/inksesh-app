import { Suspense } from "react";
import { Metadata } from "next";
import Step2SelectContent from "./content";

export const metadata: Metadata = {
  title: "Build Your Tattoo Portfolio - InkSesh",
  description:
    "Create and manage your tattoo design portfolio. Upload your designs, get AI-powered analysis for styles, themes, and body parts. Showcase your tattoo collection beautifully.",
  keywords: [
    "tattoo portfolio",
    "tattoo designs",
    "tattoo gallery",
    "tattoo artist",
  ],
  openGraph: {
    title: "Build Your Tattoo Portfolio - InkSesh",
    description:
      "Create and manage your tattoo design portfolio with AI-powered analysis.",
    type: "website",
    siteName: "InkSesh",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Your Tattoo Portfolio - InkSesh",
    description:
      "Create and manage your tattoo design portfolio with AI-powered analysis.",
  },
};

export default function Step2SelectPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center bg-neutral-950">
          <p className="text-white">Loading...</p>
        </div>
      }
    >
      <Step2SelectContent />
    </Suspense>
  );
}
