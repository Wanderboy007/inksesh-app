"use server";

import { prisma } from "@/lib/db/prisma";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

// Define the shape of the input
type ImageInput = {
  url: string;
  id: string;        // The Instagram ID
  permalink?: string; // The Instagram Post Link
};

export async function uploadAndSaveSelectedImages(
  userId: string,
  images: ImageInput[] // <--- Changed from string[] to ImageInput[]
) {
  if (!userId || images.length === 0) {
    throw new Error("Missing user ID or images");
  }

  console.log(`🚀 Starting upload for ${images.length} images...`);

  try {
    // 1. Upload to UploadThing
    // We only pass the URLs to UploadThing
    const urls = images.map((img) => img.url);
    const uploadResults = await utapi.uploadFilesFromUrl(urls);

    // 2. Map results back to original metadata
    // UploadThing returns results in the same order as the input array
    const successfulUploads = uploadResults.map((res, index) => {
      if (res.data) {
        return {
          uploadUrl: res.data.url,
          // We grab the metadata from the original array using the index
          igMediaId: images[index].id,
          igPermalink: images[index].permalink,
        };
      }
      return null;
    }).filter((item) => item !== null);

    if (successfulUploads.length === 0) {
      throw new Error("All uploads failed");
    }

    // 3. Create Records in Prisma
    // We initialize fields as empty/default so AI can populate them later
    const createdDesigns = await prisma.$transaction(
      successfulUploads.map((file) =>
        prisma.design.create({
          data: {
            userId: userId,
            imageUrl: file!.uploadUrl,
            
            // --- Storing Instagram Metadata ---
            igMediaId: file!.igMediaId,
            igPermalink: file!.igPermalink,

            // --- Empty Defaults for AI ---
            title: "Untitled Upload",
            caption: "", 
            gender: "UNISEX", // Required Enum default
            size: "MEDIUM",   // Required Enum default
            bodyPart: "",     // Empty string, AI will fix
            styles: [],       // Empty array
            themes: [],       // Empty array
          },
        })
      )
    );

    const designIds = createdDesigns.map((d) => d.id).join(",");

    return { 
      success: true, 
      redirectUrl: `/onboarding/designs?userId=${userId}&designIds=${designIds}` 
    };

  } catch (error) {
    console.error("❌ Upload failed:", error);
    return { success: false, error: "Failed to upload images" };
  }
}