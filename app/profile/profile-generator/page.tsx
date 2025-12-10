import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";
import Step2SelectContent from "./content";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // 1. Await parameters (Required for Next.js 15+)
  const searchParams = await props.searchParams;

  // 2. Define the title string (This was missing in your code)
  const mode = searchParams.mode === "edit" ? "Edit" : "Build";
  const titleString = `${mode} Your Tattoo Portfolio - InkSesh`;

  // 3. Get parent images to prevent losing the default OG image
  const parentMetadata = await parent;
  const previousImages = parentMetadata.openGraph?.images || [];

  const description =
    "Create and manage your tattoo design portfolio. Upload your designs, get AI-powered analysis for styles, themes, and body parts.";

  return {
    // 4. USE ABSOLUTE to override the parent layout template
    title: {
      absolute: titleString,
    },
    description: description,
    keywords: [
      "tattoo portfolio",
      "tattoo designs",
      "tattoo gallery",
      "tattoo artist",
    ],
    openGraph: {
      title: titleString,
      description: description,
      type: "website",
      siteName: "InkSesh",
      images: [...previousImages],
    },
    twitter: {
      card: "summary_large_image",
      title: titleString,
      description: description,
      images: [...previousImages],
    },
  };
}

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
