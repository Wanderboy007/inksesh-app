"use server";

import { prisma } from "@/lib/db/prisma";

export type DiscoverDesign = {
  id: string;
  imageUrl: string;
  title: string;
  gender: string;
  size: string;
  bodyPart: string;
  styles: string[];
  themes: string[];
  artist: {
    id: string;
    username: string;
  };
};

export async function getDiscoverDesigns(options?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ designs: DiscoverDesign[]; total: number; categories: string[] }> {
  const { category, search, limit = 24, offset = 0 } = options || {};

  const where: any = {};

  if (category && category !== "All" && category !== "Trending") {
    where.OR = [
      { styles: { has: category } },
      { themes: { has: category } },
    ];
  }

  if (search && search.trim()) {
    const searchTerm = search.trim().toLowerCase();
    where.AND = [
      ...(where.AND || []),
      {
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { bodyPart: { contains: searchTerm, mode: "insensitive" } },
          { styles: { hasSome: [searchTerm] } },
          { themes: { hasSome: [searchTerm] } },
        ],
      },
    ];
  }

  const [designs, total, allDesigns] = await Promise.all([
    prisma.design.findMany({
      where,
      select: {
        id: true,
        imageUrl: true,
        title: true,
        gender: true,
        size: true,
        bodyPart: true,
        styles: true,
        themes: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: category === "Trending" 
        ? { createdAt: "desc" } 
        : { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.design.count({ where }),
    prisma.design.findMany({
      select: { styles: true, themes: true },
    }),
  ]);

  const categorySet = new Set<string>();
  allDesigns.forEach((d) => {
    d.styles.forEach((s) => categorySet.add(s));
    d.themes.forEach((t) => categorySet.add(t));
  });

  const categories = ["All", "Trending", ...Array.from(categorySet).sort()];

  return {
    designs: designs.map((d) => ({
      id: d.id,
      imageUrl: d.imageUrl,
      title: d.title,
      gender: d.gender,
      size: d.size,
      bodyPart: d.bodyPart,
      styles: d.styles,
      themes: d.themes,
      artist: {
        id: d.user.id,
        username: d.user.username,
      },
    })),
    total,
    categories,
  };
}
