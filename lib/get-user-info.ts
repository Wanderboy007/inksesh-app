"use server";

import { prisma } from '@/lib/db/prisma';

export async function getUserById(userId: string) {
  try {
    if (!userId) {
      return { success: false, message: "User ID is required" };
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        profileUrl: true,
      },
    })


    if (!user) {
      return { success: false, message: "User not found" };
    }

    return { success: true, user };

  } catch (error) {
    return { success: false, message: "Internal server error" };
  }
}