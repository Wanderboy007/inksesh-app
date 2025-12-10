// app/designs/actions.ts
"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function updateDesign(designId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const caption = formData.get("caption") as string;
  const gender = formData.get("gender") as "MALE" | "FEMALE" | "UNISEX";
  const size = formData.get("size") as "SMALL" | "MEDIUM" | "LARGE" | "EXTRA_LARGE" | "FULL_COVERAGE";
  const bodyPart = formData.get("bodyPart") as string;
  
  const styles = (formData.get("styles") as string)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
    
  const themes = (formData.get("themes") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await prisma.design.update({
    where: { id: designId },
    data: {
      title,
      caption,
      gender,
      size,
      bodyPart,
      styles,
      themes,
    },
  });

  revalidatePath("/designs");
  return { success: true };
}