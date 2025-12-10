"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteDesign(designId: string) {
  try {
    if (!designId) throw new Error("Design ID is required");


    const design = await prisma.design.findUnique({
      where: { id: designId },
      select: { imageUrl: true },
    });

    if (!design) {
      throw new Error("Design not found");
    }


    if (design.imageUrl) {
      try {
        const fileKey = design.imageUrl.split("/").pop();

        if (fileKey) {
          await utapi.deleteFiles(fileKey);
          console.log(`🗑️ Deleted file from UploadThing: ${fileKey}`);
        }
      } catch (utError) {
       
        console.error("⚠️ Failed to delete file from UploadThing:", utError);
      }
    }
    await prisma.design.delete({
      where: { id: designId },
    });

    revalidatePath("/profile");
    
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to delete design:", error);
    return { success: false, error: "Failed to delete design" };
  }
}