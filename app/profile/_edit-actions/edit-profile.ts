"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function UpdateProfile(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;
    const username = formData.get("username") as string; // Changed from 'name'
    const instagramUrl = formData.get("instagramUrl") as string;

    if (!userId) return { success: false, message: "User ID missing" };

    await prisma.user.update({
      where: { id: userId },
      data: {
        username: username, // Update the username
        profileUrl: instagramUrl,
      },
    });

    revalidatePath("/profile");
    return { success: true, message: "Profile updated" };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, message: "Username might be taken or invalid" };
  }
}