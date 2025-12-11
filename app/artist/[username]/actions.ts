"use server";

import { prisma } from '@/lib/db/prisma'; 

export async function getArtistByUsername(username: string) {
  const artist = await prisma.user.findUnique({
    where: {
      username: username,
    },
    select: {
      id: true,
      username: true,
      profileUrl: true,
      designs: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          styles: true,
          gender: true,
          size: true,
          bodyPart: true,
        },
      },
    },
  });

  return artist;
}