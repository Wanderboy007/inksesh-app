"use server";

import { prisma } from "@/lib/db/prisma";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

type ImageInput = {
  url: string;
  id: string;
  caption?: string;
  permalink?: string;
};

export async function uploadAndSaveSelectedImages(
  userId: string,
  images: ImageInput[]
) {
  if (!userId || images.length === 0) {
    throw new Error("Missing user ID or images");
  }

  try {
    const urls = images.map((img) => img.url);
    const uploadResults = await utapi.uploadFilesFromUrl(urls);

    const successfulUploads = uploadResults.map((res, index) => {
      if (res.data) {
        return {
          uploadUrl: res.data.url,
          igMediaId: images[index].id,
          igPermalink: images[index].permalink,
        };
      }
      if (res.error) {
      }
      return null;
    }).filter((item) => item !== null);

    if (successfulUploads.length === 0) {
      throw new Error("All uploads failed");
    }

    const createdDesigns = await prisma.$transaction(
      successfulUploads.map((file) =>
        prisma.design.create({
          data: {
            userId: userId,
            imageUrl: file!.uploadUrl,
            igMediaId: file!.igMediaId,
            igPermalink: file!.igPermalink,
            title: "Untitled Upload",
            caption: "", 
            gender: "UNISEX",
            size: "MEDIUM",
            bodyPart: "",
            styles: [],
            themes: [],
          },
        })
      )
    );

    const designIds = createdDesigns.map((d) => d.id).join(",");

    try {
      const aiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/ai/generatematadata`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, designIds }),
        }
      );

      if (!aiResponse.ok) {
        const errorData = await aiResponse.json();
        throw new Error(errorData.error || "AI Analysis Failed");
      }

      const aiData = await aiResponse.json();
    } catch (aiError) {
    }

    return { 
      success: true, 
      redirectUrl: `/profile?userId=${userId}`
    };

  } catch (error) {
    return { success: false, error: "Failed to upload images" };
  }
} 


