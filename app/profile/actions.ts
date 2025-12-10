// app/designs/actions.ts
"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function updateDesign(designId: string, formData: FormData) {
  const title = formData.get("title") as string;
  // 👇 Extract caption from the form data
  const caption = formData.get("caption") as string;
  
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
      caption, // 👇 Update caption in DB
      styles,
      themes,
    },
  });

  revalidatePath("/designs");
  return { success: true };
}